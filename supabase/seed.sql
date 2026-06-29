-- Local-only seed for `supabase start` / `supabase db reset`.
--
-- Hosted Supabase grants table-level DML to the `anon`/`authenticated` roles on
-- `public` tables by default, but the local CLI stack does not, so the app's
-- authenticated reads/writes (templates, resumes) fail without these grants.
-- Row access is still governed by the RLS policies defined in the migration.
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;
