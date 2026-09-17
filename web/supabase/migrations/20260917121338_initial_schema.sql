-- Initial schema for OpenMic v0.1.
-- Implements the tables, constraints, indexes, RLS policies, and triggers
-- described in docs/03-architecture.md §4 and §11.
--
-- This migration is intentionally the full v0.1 schema in one file. Later
-- migrations should be additive (one logical change per file) and never
-- edit past migrations.

-- ============================================================
-- Extensions
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- profiles (extends auth.users 1:1)
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  practice_goals text[] not null default '{}'
    check (cardinality(practice_goals) <= 5),
  preferred_feedback_mode text not null default 'natural'
    check (preferred_feedback_mode in ('natural', 'coach')),
  age_confirmed_13_plus boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Per-user profile extending auth.users';

-- Auto-create a profile when a user signs up
create or replace function public.handle_new_user() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- scenarios (seeded catalog)
-- ============================================================

create table public.scenarios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null check (category in (
    'interviews', 'meetings-work', 'small-talk',
    'esl-fluency', 'difficult-conversations'
  )),
  title text not null,
  description text not null,
  suggested_ai_role text not null,
  suggested_difficulty text not null check (
    suggested_difficulty in ('easy', 'normal', 'challenging')
  ),
  system_prompt_template text not null,
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index scenarios_category_active_idx
  on public.scenarios (category, display_order)
  where is_active;

comment on table public.scenarios is 'Curated practice scenarios shown in the catalog';

-- ============================================================
-- sessions
-- ============================================================

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  guest_cookie_hash text,
  scenario_id uuid references public.scenarios(id) on delete set null,
  custom_topic text check (custom_topic is null or length(custom_topic) between 20 and 500),
  ai_role text not null check (length(ai_role) <= 100),
  difficulty text not null check (difficulty in ('easy', 'normal', 'challenging')),
  feedback_mode text not null check (feedback_mode in ('natural', 'coach')),
  status text not null default 'active'
    check (status in ('active', 'ended', 'timed_out')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,

  constraint session_has_owner check (
    (user_id is not null and guest_cookie_hash is null) or
    (user_id is null and guest_cookie_hash is not null)
  ),

  constraint session_end_timestamp check (
    (status = 'active' and ended_at is null) or
    (status <> 'active' and ended_at is not null)
  ),

  constraint session_has_source check (
    scenario_id is not null or custom_topic is not null
  )
);

create index sessions_user_started_idx
  on public.sessions (user_id, started_at desc)
  where user_id is not null;

create index sessions_guest_idx
  on public.sessions (guest_cookie_hash)
  where guest_cookie_hash is not null;

create index sessions_active_idx
  on public.sessions (id) where status = 'active';

comment on table public.sessions is 'One conversation from start to feedback report';

-- ============================================================
-- messages
-- ============================================================

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  sender text not null check (sender in ('user', 'ai', 'coach')),
  content text not null check (length(content) between 1 and 5000),
  token_count int,
  created_at timestamptz not null default now()
);

create index messages_session_created_idx
  on public.messages (session_id, created_at);

comment on table public.messages is 'Individual turns. Not stored for guest sessions (see architecture §11.3).';

-- ============================================================
-- feedback_reports
-- ============================================================

create table public.feedback_reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid unique not null references public.sessions(id) on delete cascade,
  strengths text[] not null check (cardinality(strengths) between 1 and 5),
  growth_areas text[] not null check (cardinality(growth_areas) between 1 and 5),
  suggestions text[] not null check (cardinality(suggestions) between 1 and 5),
  raw_report text not null,
  rating smallint not null default 0 check (rating in (-1, 0, 1)),
  model text not null,
  prompt_tokens int,
  completion_tokens int,
  generated_at timestamptz not null default now()
);

comment on table public.feedback_reports is 'End-of-session AI feedback (one per session)';

-- ============================================================
-- flags
-- ============================================================

create table public.flags (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  reason text check (reason is null or length(reason) <= 500),
  reviewed boolean not null default false,
  created_at timestamptz not null default now()
);

create index flags_unreviewed_idx on public.flags (created_at) where not reviewed;

comment on table public.flags is 'User-reported issues. v0.1 has no admin UI.';

-- ============================================================
-- guest_sessions
-- ============================================================

create table public.guest_sessions (
  cookie_hash text primary key,
  ip_hash text,
  session_count int not null default 0,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index guest_sessions_ip_idx on public.guest_sessions (ip_hash);

comment on table public.guest_sessions is 'Guest usage tracking. Cookie and IP are hashed; no PII. Service-role only access.';

-- ============================================================
-- rate_limits
-- ============================================================

create table public.rate_limits (
  key text primary key,
  count int not null default 0,
  window_started_at timestamptz not null default now()
);

comment on table public.rate_limits is 'Server-side rate limit counters. See architecture §9.';

-- ============================================================
-- updated_at trigger for profiles
-- ============================================================

create or replace function public.set_updated_at() returns trigger
  language plpgsql
  set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row-Level Security (see architecture §4.3)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.scenarios enable row level security;
alter table public.sessions enable row level security;
alter table public.messages enable row level security;
alter table public.feedback_reports enable row level security;
alter table public.flags enable row level security;
alter table public.guest_sessions enable row level security;
alter table public.rate_limits enable row level security;

-- profiles: read + update your own
create policy profiles_select_own on public.profiles
  for select using (id = (select auth.uid()));

create policy profiles_update_own on public.profiles
  for update using (id = (select auth.uid()));

-- scenarios: public read of active rows
create policy scenarios_select_active on public.scenarios
  for select using (is_active);

-- sessions: read/write your own (guests via service role, no policy needed for that path)
create policy sessions_select_own on public.sessions
  for select using (user_id = (select auth.uid()));

create policy sessions_insert_own on public.sessions
  for insert with check (user_id = (select auth.uid()));

create policy sessions_update_own on public.sessions
  for update using (user_id = (select auth.uid()));

create policy sessions_delete_own on public.sessions
  for delete using (user_id = (select auth.uid()));

-- messages: read/write only messages in your own sessions
create policy messages_select_own on public.messages
  for select using (
    exists (
      select 1 from public.sessions s
      where s.id = messages.session_id and s.user_id = (select auth.uid())
    )
  );

create policy messages_insert_own on public.messages
  for insert with check (
    exists (
      select 1 from public.sessions s
      where s.id = messages.session_id and s.user_id = (select auth.uid())
    )
  );

-- feedback_reports: read + rate reports on your own sessions
create policy reports_select_own on public.feedback_reports
  for select using (
    exists (
      select 1 from public.sessions s
      where s.id = feedback_reports.session_id and s.user_id = (select auth.uid())
    )
  );

create policy reports_update_own on public.feedback_reports
  for update using (
    exists (
      select 1 from public.sessions s
      where s.id = feedback_reports.session_id and s.user_id = (select auth.uid())
    )
  );

-- flags: users may insert flags on their own sessions
create policy flags_insert_own on public.flags
  for insert with check (
    user_id = (select auth.uid())
    or (
      user_id is null
      and session_id in (
        select id from public.sessions where user_id = (select auth.uid())
      )
    )
  );

-- guest_sessions + rate_limits: RLS enabled with no policies = service-role only.
