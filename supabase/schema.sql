-- SaahiRides Supabase foundation (review before running in production)
-- Run in Supabase SQL Editor only after reviewing this file.
-- Does not create an administrator or HR publisher automatically.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','owner')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- HR publisher grants must be added/removed by an owner/admin through the SQL Editor.
create table if not exists public.hr_publishers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.policy_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('HR','Customer','Driver','Admin Governance')),
  body text not null,
  version text not null,
  effective_date date,
  review_date date,
  status text not null default 'draft'
    check (status in ('draft','pending approval','published','superseded','archived')),
  audience text[] not null default '{}',
  acknowledgement_required boolean not null default false,
  author_id uuid references auth.users(id),
  approver_id uuid references auth.users(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.policy_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.policy_documents(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  policy_version text not null,
  acknowledged_at timestamptz not null default now(),
  unique (policy_id, user_id, policy_version)
);

create or replace function public.is_saahirides_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = (select auth.uid()) and au.active = true
  );
$$;

create or replace function public.is_saahirides_hr_publisher()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.hr_publishers hp
    where hp.user_id = (select auth.uid()) and hp.active = true
  );
$$;

alter table public.admin_users enable row level security;
alter table public.hr_publishers enable row level security;
alter table public.policy_documents enable row level security;
alter table public.policy_acknowledgements enable row level security;

drop policy if exists "admins can read their own admin record" on public.admin_users;
create policy "admins can read their own admin record"
on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "hr publishers can read their own grant" on public.hr_publishers;
create policy "hr publishers can read their own grant"
on public.hr_publishers for select to authenticated
using (user_id = (select auth.uid()));

-- Admin/Owner controls all policy records.
drop policy if exists "admins manage policy documents" on public.policy_documents;
create policy "admins manage policy documents"
on public.policy_documents for all to authenticated
using (public.is_saahirides_admin())
with check (public.is_saahirides_admin());

-- HR can only read/create/update/delete HR-category policy records.
-- The HR grant itself cannot be self-created or edited from the browser.
drop policy if exists "hr manage HR policies only" on public.policy_documents;
create policy "hr manage HR policies only"
on public.policy_documents for all to authenticated
using (category = 'HR' and public.is_saahirides_hr_publisher())
with check (category = 'HR' and public.is_saahirides_hr_publisher());

-- Secure interim default: customers/drivers cannot read policy rows until
-- explicit customer/driver role mapping is implemented and tested.
drop policy if exists "audiences read published policies" on public.policy_documents;
drop policy if exists "admins read policy documents" on public.policy_documents;
create policy "admins read policy documents"
on public.policy_documents for select to authenticated
using (public.is_saahirides_admin());

drop policy if exists "users read own acknowledgements" on public.policy_acknowledgements;
create policy "users read own acknowledgements"
on public.policy_acknowledgements for select to authenticated
using (user_id = (select auth.uid()) or public.is_saahirides_admin());

drop policy if exists "users create own acknowledgements" on public.policy_acknowledgements;
create policy "users create own acknowledgements"
on public.policy_acknowledgements for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.policy_documents p
    where p.id = policy_id
      and p.status = 'published'
      and p.acknowledgement_required = true
      and p.version = policy_version
  )
);

-- No client-side insert/update/delete policies for admin_users or hr_publishers.
-- Add the verified owner UUID to admin_users, then explicitly grant HR users.
-- Never allow self-service admin or HR permission grants.
