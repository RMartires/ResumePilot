-- Per-user payment history (synced from Dodo webhooks + optional API backfill)
create table if not exists public.billing_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  dodo_payment_id text not null unique,
  dodo_subscription_id text,
  status text not null,
  amount_cents integer not null default 0 check (amount_cents >= 0),
  currency text not null default 'INR',
  payment_method text,
  invoice_url text,
  error_message text,
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists billing_transactions_user_id_paid_at_idx
  on public.billing_transactions (user_id, paid_at desc);

alter table public.billing_transactions enable row level security;

create policy "Users can view own billing transactions"
  on public.billing_transactions for select
  using (auth.uid() = user_id);

drop trigger if exists billing_transactions_updated_at on public.billing_transactions;
create trigger billing_transactions_updated_at
  before update on public.billing_transactions
  for each row execute function public.set_updated_at();
