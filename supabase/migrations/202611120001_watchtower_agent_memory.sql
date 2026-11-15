-- Watchtower X long-term, searchable memory.
-- Apply only after owner review. This migration does not alter existing business tables.

create table if not exists private_core.agent_memory (
  id uuid primary key default gen_random_uuid(),
  agent_key text not null default 'watchtower_master',
  memory_type text not null check (memory_type in ('project_fact','decision','preference','lesson','research','risk','task_outcome')),
  title text not null,
  content text not null,
  tags text[] not null default '{}',
  source text not null,
  source_url text,
  confidence numeric(4,3) not null default 0.700 check (confidence >= 0 and confidence <= 1),
  importance smallint not null default 3 check (importance between 1 and 5),
  supersedes_id uuid references private_core.agent_memory(id),
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  search_document tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) stored,
  created_at timestamptz not null default now()
);

create index if not exists agent_memory_search_idx
  on private_core.agent_memory using gin (search_document);
create index if not exists agent_memory_recent_idx
  on private_core.agent_memory (agent_key, created_at desc);
create index if not exists agent_memory_tags_idx
  on private_core.agent_memory using gin (tags);

alter table private_core.agent_memory enable row level security;
revoke all on private_core.agent_memory from public, anon, authenticated;
revoke update, delete, truncate on private_core.agent_memory from public, anon, authenticated, service_role;
grant select, insert on private_core.agent_memory to service_role;

create or replace function private_core.search_agent_memory(
  query_text text,
  result_limit integer default 12
)
returns table (
  id uuid,
  memory_type text,
  title text,
  content text,
  tags text[],
  source text,
  source_url text,
  confidence numeric,
  importance smallint,
  created_at timestamptz,
  relevance real
)
language sql
stable
security invoker
set search_path = private_core, pg_temp
as $$
  select m.id, m.memory_type, m.title, m.content, m.tags, m.source,
         m.source_url, m.confidence, m.importance, m.created_at,
         ts_rank(m.search_document, websearch_to_tsquery('english', coalesce(query_text, ''))) as relevance
  from private_core.agent_memory m
  where m.agent_key = 'watchtower_master'
    and (m.expires_at is null or m.expires_at > now())
    and (
      nullif(trim(coalesce(query_text, '')), '') is null
      or m.search_document @@ websearch_to_tsquery('english', query_text)
    )
  order by
    case when nullif(trim(coalesce(query_text, '')), '') is null then 0
         else ts_rank(m.search_document, websearch_to_tsquery('english', query_text)) end desc,
    m.importance desc,
    m.created_at desc
  limit least(greatest(coalesce(result_limit, 12), 1), 30);
$$;

revoke all on function private_core.search_agent_memory(text, integer) from public, anon, authenticated;
grant execute on function private_core.search_agent_memory(text, integer) to service_role;

comment on table private_core.agent_memory is
  'Append-only, searchable long-term memory for Watchtower X. Private to service-role workflows; contains no credentials or secrets.';


-- Seed durable owner-approved project context so the first run is not memory-empty.
insert into private_core.agent_memory
  (agent_key, memory_type, title, content, tags, source, confidence, importance)
select
  'watchtower_master', v.memory_type, v.title, v.content, v.tags,
  'owner_context_seed', 1.000, v.importance
from (values
  ('project_fact', 'SaahiRides website and preservation rule',
   'SaahiRides Transit Pvt. Ltd. operates saahirides.co.in. The existing static website must be improved in place; do not rebuild from scratch, overwrite existing site code, or overwrite existing Supabase data. The original investor pitch deck is archival and must remain untouched.',
   array['website','architecture','preservation'], 5),
  ('decision', 'Owner and director approval boundary',
   'Final business, intellectual-property and production decisions require Joint Founder and at least one Director approval. Agents may research, propose, implement in isolated branches and test, but must not self-approve production or IP decisions.',
   array['governance','approval','production'], 5),
  ('preference', 'SaahiRides mapping provider preference',
   'The preferred primary mapping and routing provider is Ola Maps because of its suitability for Indian roads. Consider an in-house mapping layer only later if existing map providers are inadequate.',
   array['maps','routing','provider'], 4),
  ('decision', 'SaahiRides fare and pricing guardrails',
   'The owner specified on-demand rates effective 2026-11-02: Scooty 12/13.5/15; Scooty EV 16; Auto 16.5/17.5/19; Electric Auto 19; Non-AC Cab 19.5/21/22; AC Cab 22.5/24/25 for Standard/Express/Super Fast. Never change fares without explicit owner approval.',
   array['pricing','fares','business-rules'], 5),
  ('decision', 'Driver earnings and fee guardrails',
   'The owner specified a 75/25 driver/platform split and no commission or joining fees for the current driver model. Treat this as a recorded business rule, not permission to alter payout implementation without approval.',
   array['drivers','payouts','business-rules'], 5),
  ('project_fact', 'Outstation cab pricing rules',
   'Outstation service is cab-only. Minimum billing distance is 300 km. Pricing is all-inclusive except 5% GST; toll, parking, fuel and driver bata are not separate extras under the stated package. Advance is 50%. Never alter published pricing without approval.',
   array['outstation','cabs','pricing'], 4),
  ('preference', 'Social publishing consistency',
   'When a post is approved for Facebook and Instagram, use the same approved media and caption on both by default unless the owner specifies otherwise. Confirm each platform separately; Instagram publication does not prove Facebook publication and vice versa.',
   array['social','facebook','instagram'], 4),
  ('lesson', 'Daily QA completion standard',
   'A daily website QA run is not complete unless the full scheduled Chromium/Playwright suite actually executes with evidence. Partial or infrastructure-blocked runs must remain incomplete and be escalated; never report them as successful or closed.',
   array['qa','testing','quality'], 5),
  ('decision', 'Supabase security and architecture guardrails',
   'Supabase is the central record system for SaahiRides. Keep API keys in secrets, use parameterized SQL, enforce RLS, isolate private schemas, preserve backups and firewall protections, and limit production write access to approved owner/superadmin paths.',
   array['supabase','security','architecture'], 5),
  ('project_fact', 'SaahiRides current launch and marketing context',
   'The business is early-stage with no outside funding. The owner has stated there is no office to list and does not want an office listing yet. Avoid claiming an office address or inventing customers, drivers, traction or partnerships.',
   array['business','marketing','facts'], 4),
  ('decision', 'SaahiRides social and media approval workflow',
   'Media gathered for the SaahiRides website or campaigns must be reviewed and approved before publication or placement where approval is required. Preserve the existing raw-image review workflow and do not reopen already completed rollout work without evidence of a new defect.',
   array['media','approval','social'], 4),
  ('project_fact', 'SaahiRides driver recruitment update',
   'As of 2026-11-12, the owner reported one prospective driver ready to join who is also willing to help with marketing. This is a reported prospective joiner, not proof that onboarding or activation is complete.',
   array['driver','recruitment','marketing'], 4)
) as v(memory_type, title, content, tags, importance)
where not exists (
  select 1 from private_core.agent_memory m
  where m.agent_key = 'watchtower_master'
    and m.source = 'owner_context_seed'
    and m.title = v.title
);
