-- Super Admin login throttling only. Does not alter existing SaahiRides data.
create table if not exists public.super_admin_login_attempts (
  limiter_id text primary key,
  failures integer not null default 0 check (failures >= 0),
  window_started_at timestamptz not null default now(),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.super_admin_login_attempts enable row level security;
revoke all on public.super_admin_login_attempts from anon, authenticated;
-- Supabase Edge Function accesses this table with the service-role key stored server-side.
