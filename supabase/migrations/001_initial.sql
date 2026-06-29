-- Templates (public read)
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  preview_url text,
  config jsonb not null default '{}',
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Resumes owned by auth.users
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null default 'Untitled Resume',
  template_id uuid references public.templates,
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists resumes_user_id_idx on public.resumes (user_id);

-- Seed default templates
insert into public.templates (slug, name, description, config, is_default) values
  (
    'classic',
    'Classic',
    'Traditional serif layout with uppercase section headings.',
    '{"fontFamily":"Libre Baskerville, Georgia, serif","fontSize":"0.72rem","accentColor":"#1a1a1a","sectionSpacing":"14px","headingTransform":"uppercase","layout":"standard"}',
    true
  ),
  (
    'compact',
    'Compact',
    'Clean sans-serif with blue accents and relaxed spacing.',
    '{"fontFamily":"Inter, system-ui, sans-serif","fontSize":"0.75rem","accentColor":"#2563eb","sectionSpacing":"18px","headingTransform":"none","layout":"standard"}',
    false
  ),
  (
    'modern',
    'Modern',
    'Two-column layout with sidebar for contact info.',
    '{"fontFamily":"Inter, system-ui, sans-serif","fontSize":"0.75rem","accentColor":"#2D9C6C","sectionSpacing":"18px","headingTransform":"uppercase","layout":"sidebar"}',
    false
  )
on conflict (slug) do nothing;

-- RLS
alter table public.resumes enable row level security;
alter table public.templates enable row level security;

create policy "Users can view own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

create policy "Templates are publicly readable"
  on public.templates for select
  using (true);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists resumes_updated_at on public.resumes;
create trigger resumes_updated_at
  before update on public.resumes
  for each row execute function public.set_updated_at();
