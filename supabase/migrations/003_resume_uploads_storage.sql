-- Private bucket for uploaded resume PDFs (saved before parsing for debugging/retry).
insert into storage.buckets (id, name, public)
values ('resume-uploads', 'resume-uploads', false)
on conflict (id) do nothing;

-- Track every upload attempt so failed files can be inspected in Supabase Storage.
create table if not exists public.resume_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  file_path text not null,
  file_name text not null,
  file_size bigint not null,
  mime_type text,
  status text not null default 'processing'
    check (status in ('processing', 'success', 'failed')),
  error_message text,
  resume_id uuid references public.resumes on delete set null,
  created_at timestamptz default now()
);

create index if not exists resume_uploads_user_id_idx on public.resume_uploads (user_id);
create index if not exists resume_uploads_status_idx on public.resume_uploads (status);
create index if not exists resume_uploads_created_at_idx on public.resume_uploads (created_at desc);

alter table public.resume_uploads enable row level security;

create policy "Users can view own resume uploads"
  on public.resume_uploads for select
  using (auth.uid() = user_id);

create policy "Users can insert own resume uploads"
  on public.resume_uploads for insert
  with check (auth.uid() = user_id);

create policy "Users can update own resume uploads"
  on public.resume_uploads for update
  using (auth.uid() = user_id);

-- Storage RLS: users read/write only under {user_id}/*
create policy "Users can upload own resume PDFs"
  on storage.objects for insert
  with check (
    bucket_id = 'resume-uploads'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can read own resume PDFs"
  on storage.objects for select
  using (
    bucket_id = 'resume-uploads'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own resume PDFs"
  on storage.objects for delete
  using (
    bucket_id = 'resume-uploads'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
