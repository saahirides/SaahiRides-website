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
