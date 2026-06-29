# AGENTS.md

This repo is a **Resume Builder**. The active product is the Next.js app in [`web/`](web/)
(Supabase auth + Postgres, live preview, PDF export). The root-level `index.html` +
`serve.py` legacy vanilla app and `generate_from_json.py` CLI are deprecated.

Standard commands live in [`README.md`](README.md), [`web/README.md`](web/README.md),
and `web/package.json` scripts (`dev`, `build`, `lint`, `test`, `test:e2e`). See also
[`web/AGENTS.md`](web/AGENTS.md) — Next.js 16 has breaking changes vs. older training data.

## Cursor Cloud specific instructions

The update script only runs `npm --prefix web install`. Everything below is started
manually per session (these are services, intentionally NOT in the update script).

### Local Supabase is required to run the app
The app reads `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` and fails
without a Supabase backend. We run Supabase locally via the Supabase CLI (needs Docker).
Docker, the Supabase CLI, and the `supabase/config.toml` are already provisioned in the
VM image; you just need to (re)start the services:

```bash
sudo dockerd >/tmp/dockerd.log 2>&1 &     # start Docker daemon (not auto-started)
sleep 8
supabase start                            # from repo root; applies migrations + seed
```

- `supabase start` prints the `API_URL` (http://127.0.0.1:54321) and `ANON_KEY`. These
  local keys are fixed shared dev defaults, so `web/.env.local` can be committed-style
  static (it is gitignored). If `web/.env.local` is missing, create it with
  `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321` and the printed `ANON_KEY`.
- Supabase Studio: http://127.0.0.1:54323 · Mailpit (emails): http://127.0.0.1:54324.
- If Docker access is denied (`permission denied ... docker.sock`), the `ubuntu` user is
  in the `docker` group but the current shell may predate it — re-exec the shell or run
  `sudo chmod 666 /var/run/docker.sock` for the session.

### Non-obvious: tables need explicit grants locally
The migration enables RLS but relies on Supabase's *legacy* auto-expose behavior. Newer
Supabase (local + new cloud default) does NOT auto-grant `anon`/`authenticated` access to
`public` tables, so reads/writes 403 with "permission denied for table ...".
[`supabase/seed.sql`](supabase/seed.sql) restores those grants and is applied
automatically by `supabase start` / `supabase db reset` (local only — never pushed to a
remote project). If you reset the DB out-of-band, re-apply it with
`docker exec -i supabase_db_workspace psql -U postgres -d postgres < supabase/seed.sql`.

### Auth is Google-OAuth-only in the UI
The login page (`/login`, `/signup` redirects there) only offers "Continue with Google".
There is no email/password form, and local Supabase has no Google provider configured, so
you cannot sign in through the UI locally. To exercise authenticated flows, mint a session
out-of-band: create a confirmed user via the GoTrue admin API
(`POST http://127.0.0.1:54321/auth/v1/admin/users` with the `service_role` key and
`email_confirm: true`), sign in with `@supabase/ssr` to obtain the `sb-127-auth-token`
cookie, then inject it into the browser (e.g. a Playwright `context.addCookies`). Then
`/dashboard` → "New Resume" creates a resume and opens the editor (autosave debounced
~250ms to Supabase).

### Dev server
`npm --prefix web run dev` serves http://localhost:3000 (Turbopack). Playwright E2E
(`npm --prefix web run test:e2e`) needs browsers: `npx playwright install chromium`
(already installed in the VM image).
