-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  dodo_customer_id text unique,
  referral_code text,
  plan_tier text not null default 'free' check (plan_tier in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_dodo_customer_id_idx
  on public.profiles (dodo_customer_id)
  where dodo_customer_id is not null;

-- Subscriptions synced from Dodo webhooks
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  dodo_subscription_id text not null unique,
  dodo_customer_id text,
  product_id text,
  status text not null default 'pending',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

-- Idempotent webhook log
create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  dodo_event_id text not null unique,
  event_type text not null,
  payload jsonb not null default '{}',
  processed_at timestamptz not null default now()
);

-- DIY affiliate partners (manage via SQL or admin)
create table if not exists public.referral_partners (
  code text primary key,
  name text not null,
  commission_pct numeric(5, 2) not null default 20.00,
  payout_email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Conversion ledger for manual payouts
create table if not exists public.referral_conversions (
  id uuid primary key default gen_random_uuid(),
  partner_code text not null references public.referral_partners (code),
  user_id uuid references auth.users on delete set null,
  dodo_payment_id text,
  dodo_subscription_id text,
  amount_cents integer not null default 0,
  currency text not null default 'USD',
  commission_cents integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (dodo_payment_id)
);

create index if not exists referral_conversions_partner_code_idx
  on public.referral_conversions (partner_code);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_events enable row level security;
alter table public.referral_partners enable row level security;
alter table public.referral_conversions enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Service role writes billing_events, subscriptions, referral_conversions via webhook handler
