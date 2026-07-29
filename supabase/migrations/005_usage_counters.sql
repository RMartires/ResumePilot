-- Monthly usage counters for free-tier limits (resets each calendar month)
create table if not exists public.usage_counters (
  user_id uuid not null references auth.users on delete cascade,
  period_month date not null,
  ai_chat_count integer not null default 0 check (ai_chat_count >= 0),
  ats_check_count integer not null default 0 check (ats_check_count >= 0),
  resume_score_count integer not null default 0 check (resume_score_count >= 0),
  pdf_download_count integer not null default 0 check (pdf_download_count >= 0),
  primary key (user_id, period_month)
);

create index if not exists usage_counters_user_id_idx
  on public.usage_counters (user_id);

alter table public.usage_counters enable row level security;

create policy "Users can view own usage counters"
  on public.usage_counters for select
  using (auth.uid() = user_id);

-- Service role increments counters from API routes
