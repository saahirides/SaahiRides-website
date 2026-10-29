-- Hardening applied to SaahiRides Project on 2026-10-29.
-- Move authorization helper functions out of the exposed public API schema,
-- retain RLS access for authenticated users, and enforce Owner/Admin separation.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_saahirides_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admin_users au where au.user_id=(select auth.uid()) and au.active=true); $$;
create or replace function private.is_saahirides_owner()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admin_users au where au.user_id=(select auth.uid()) and au.active=true and au.role='owner'); $$;
create or replace function private.is_saahirides_hr_publisher()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.hr_publishers hp where hp.user_id=(select auth.uid()) and hp.active=true); $$;

revoke all on function private.is_saahirides_admin() from public, anon;
revoke all on function private.is_saahirides_owner() from public, anon;
revoke all on function private.is_saahirides_hr_publisher() from public, anon;
grant execute on function private.is_saahirides_admin() to authenticated;
grant execute on function private.is_saahirides_owner() to authenticated;
grant execute on function private.is_saahirides_hr_publisher() to authenticated;

drop policy if exists "owner manages all policy documents" on public.policy_documents;
create policy "owner manages all policy documents" on public.policy_documents for all to authenticated using (private.is_saahirides_owner()) with check (private.is_saahirides_owner());
drop policy if exists "admins manage non-governance policies" on public.policy_documents;
create policy "admins manage non-governance policies" on public.policy_documents for all to authenticated using (private.is_saahirides_admin() and not private.is_saahirides_owner() and category in ('HR','Customer','Driver')) with check (private.is_saahirides_admin() and not private.is_saahirides_owner() and category in ('HR','Customer','Driver'));
drop policy if exists "hr manage HR policies only" on public.policy_documents;
create policy "hr manage HR policies only" on public.policy_documents for all to authenticated using (category='HR' and private.is_saahirides_hr_publisher()) with check (category='HR' and private.is_saahirides_hr_publisher());
drop policy if exists "admins read policy documents" on public.policy_documents;
create policy "admins read policy documents" on public.policy_documents for select to authenticated using (private.is_saahirides_admin());
drop policy if exists "admins read policy approvals" on public.policy_approvals;
create policy "admins read policy approvals" on public.policy_approvals for select to authenticated using (private.is_saahirides_admin());
drop policy if exists "users read own acknowledgements" on public.policy_acknowledgements;
create policy "users read own acknowledgements" on public.policy_acknowledgements for select to authenticated using (user_id=(select auth.uid()) or private.is_saahirides_admin());

create or replace function private.enforce_policy_publication_approval()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare caller uuid := (select auth.uid()); founder_id uuid; director_id uuid; content_changed boolean := false; needs_approval boolean := false;
begin
 if tg_op='UPDATE' then
  content_changed := new.title is distinct from old.title or new.category is distinct from old.category or new.body is distinct from old.body or new.version is distinct from old.version or new.effective_date is distinct from old.effective_date or new.review_date is distinct from old.review_date or new.audience is distinct from old.audience or new.acknowledgement_required is distinct from old.acknowledgement_required;
  if old.status='published' and content_changed and new.version is not distinct from old.version then raise exception 'Published policy content cannot change under the same version. Create a new version and obtain both approvals.'; end if;
  if content_changed then update public.policy_approvals set revoked_at=now() where policy_id=new.id and revoked_at is null; end if;
  needs_approval := new.status='published' and (old.status is distinct from 'published' or old.version is distinct from new.version or content_changed);
 else needs_approval := new.status='published'; end if;
 if needs_approval then
  if caller is not null and private.is_saahirides_hr_publisher() then raise exception 'HR publishers cannot publish policies. Submit the policy for governance approval.'; end if;
  select pa.approver_id into founder_id from public.policy_approvals pa join public.governance_approvers ga on ga.user_id=pa.approver_id where pa.policy_id=new.id and pa.revoked_at is null and pa.policy_version=new.version and pa.approval_role='joint_founder' and ga.approval_role='joint_founder' and ga.active=true limit 1;
  select pa.approver_id into director_id from public.policy_approvals pa join public.governance_approvers ga on ga.user_id=pa.approver_id where pa.policy_id=new.id and pa.revoked_at is null and pa.policy_version=new.version and pa.approval_role='director' and ga.approval_role='director' and ga.active=true and pa.approver_id is distinct from founder_id limit 1;
  if founder_id is null or director_id is null then raise exception 'Publication blocked: Joint Founder and at least one distinct Director must approve this exact policy version.'; end if;
 end if;
 return new;
end;
$$;
revoke all on function private.enforce_policy_publication_approval() from public, anon, authenticated;
drop trigger if exists policy_publication_requires_dual_approval on public.policy_documents;
create trigger policy_publication_requires_dual_approval before insert or update on public.policy_documents for each row execute function private.enforce_policy_publication_approval();
drop function if exists public.is_saahirides_admin();
drop function if exists public.is_saahirides_owner();
drop function if exists public.is_saahirides_hr_publisher();
