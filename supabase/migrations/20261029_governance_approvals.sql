-- SaahiRides mandatory governance approval guard.
-- Review and run only after the base supabase/schema.sql has been installed.
-- Assign approver roles through the Supabase SQL Editor only; never from browser code.

create table if not exists public.governance_approvers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  approval_role text not null check (approval_role in ('joint_founder','director')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.policy_approvals (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.policy_documents(id) on delete cascade,
  policy_version text not null,
  approver_id uuid not null references auth.users(id) on delete cascade,
  approval_role text not null check (approval_role in ('joint_founder','director')),
  approved_at timestamptz not null default now(),
  unique (policy_id, policy_version, approver_id)
);

alter table public.governance_approvers enable row level security;
alter table public.policy_approvals enable row level security;

-- Designated approvers need to inspect policy versions before approving them.
drop policy if exists "governance approvers read policy documents" on public.policy_documents;
create policy "governance approvers read policy documents"
on public.policy_documents for select to authenticated
using (
  exists (
    select 1 from public.governance_approvers ga
    where ga.user_id = (select auth.uid()) and ga.active = true
  )
);

-- No browser write policy exists for governance_approvers: role assignments are
-- deliberately restricted to the SQL Editor / trusted database administration.
drop policy if exists "approvers read own assignment" on public.governance_approvers;
create policy "approvers read own assignment"
on public.governance_approvers for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "admins read policy approvals" on public.policy_approvals;
create policy "admins read policy approvals"
on public.policy_approvals for select to authenticated
using (public.is_saahirides_admin());

drop policy if exists "approvers read their own approvals" on public.policy_approvals;
create policy "approvers read their own approvals"
on public.policy_approvals for select to authenticated
using (approver_id = (select auth.uid()));

drop policy if exists "active approvers submit their own approvals" on public.policy_approvals;
create policy "active approvers submit their own approvals"
on public.policy_approvals for insert to authenticated
with check (
  approver_id = (select auth.uid())
  and exists (
    select 1 from public.governance_approvers ga
    where ga.user_id = (select auth.uid())
      and ga.active = true
      and ga.approval_role = policy_approvals.approval_role
  )
  and exists (
    select 1 from public.policy_documents p
    where p.id = policy_id
      and p.version = policy_version
      and p.status in ('draft','pending approval')
  )
);

-- HR publishers may prepare and submit drafts but may never publish directly.
-- Publishing requires an approval from the assigned joint founder and at least
-- one distinct assigned director for the exact policy version.
create or replace function public.enforce_policy_publication_approval()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller uuid := (select auth.uid());
  founder_id uuid;
  director_id uuid;
  content_changed boolean := false;
begin
  -- A published policy's content cannot be silently edited under the same version.
  -- Any content change on an already-published row must use a new version.
  if tg_op = 'UPDATE' and old.status = 'published' then
    content_changed :=
      new.title is distinct from old.title
      or new.category is distinct from old.category
      or new.body is distinct from old.body
      or new.effective_date is distinct from old.effective_date
      or new.review_date is distinct from old.review_date
      or new.audience is distinct from old.audience
      or new.acknowledgement_required is distinct from old.acknowledgement_required;

    if content_changed and new.version is not distinct from old.version then
      raise exception 'Published policy content cannot change under the same version. Create a new version and obtain both approvals.';
    end if;
  end if;

  -- Require fresh approvals whenever publishing, republishing, or changing the
  -- version/content of a published policy. The approvals must match this exact version.
  if new.status = 'published' and (
    tg_op = 'INSERT'
    or old.status is distinct from 'published'
    or old.version is distinct from new.version
    or content_changed
  ) then
    if caller is not null and public.is_saahirides_hr_publisher() then
      raise exception 'HR publishers cannot publish policies. Submit the policy for governance approval.';
    end if;

    select pa.approver_id into founder_id
    from public.policy_approvals pa
    join public.governance_approvers ga on ga.user_id = pa.approver_id
    where pa.policy_id = new.id
      and pa.policy_version = new.version
      and pa.approval_role = 'joint_founder'
      and ga.approval_role = 'joint_founder'
      and ga.active = true
    limit 1;

    select pa.approver_id into director_id
    from public.policy_approvals pa
    join public.governance_approvers ga on ga.user_id = pa.approver_id
    where pa.policy_id = new.id
      and pa.policy_version = new.version
      and pa.approval_role = 'director'
      and ga.approval_role = 'director'
      and ga.active = true
      and pa.approver_id is distinct from founder_id
    limit 1;

    if founder_id is null or director_id is null then
      raise exception 'Publication blocked: Joint Founder and at least one distinct Director must approve this exact policy version.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists policy_publication_requires_dual_approval on public.policy_documents;
create trigger policy_publication_requires_dual_approval
before insert or update on public.policy_documents
for each row execute function public.enforce_policy_publication_approval();

-- No delete/update policies for approvals: submitted approvals are immutable
-- from the client. Corrections/revocations require trusted database administration.
