# Resume Builder (Next.js)

Modern resume builder with Supabase auth, cloud sync, templates, and live PDF preview.

## Stack

- **Next.js 16** (App Router)
- **Supabase** (Auth + Postgres)
- **shadcn/ui** + Tailwind CSS
- **TypeScript** + Zod

## Quick start

### 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in [`../supabase/migrations/001_initial.sql`](../supabase/migrations/001_initial.sql) via the SQL editor
3. Copy env vars:

```bash
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 2. Run locally

```bash
cd web
npm install
npm run dev
```

Open **http://localhost:3000**

### 3. Create an account

Sign up at `/signup` (email/password or Google), then create resumes from the dashboard.

### 4. Google OAuth (optional)

1. In [Google Cloud Console](https://console.cloud.google.com/), create OAuth 2.0 credentials (Web application).
2. Add **Authorized redirect URI**: `https://<your-project-ref>.supabase.co/auth/v1/callback`  
   (find your project ref in Supabase → Project Settings → General)
3. In Supabase → **Authentication → Providers → Google**, enable Google and paste the Client ID + Client Secret.
4. In Supabase → **Authentication → URL Configuration**, add these **Redirect URLs** (use wildcards — exact paths often fail for localhost):
   - `http://localhost:3000/**`
   - `http://127.0.0.1:3000/**` (if you open the app via 127.0.0.1 instead of localhost)
   - `https://your-domain.com/auth/callback` (production)

   Keep **Site URL** as your production domain. Click **Save** after adding URLs.

   For local dev, copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

   **Troubleshooting:** If sign-in sends you to production, open DevTools → Console on localhost and look for `[auth] OAuth redirectTo:`. That exact URL (or its wildcard) must be in Supabase Redirect URLs. Sign in only from `http://localhost:3000`, not `resumepilot.xyz`.

No extra env vars are needed in the Next.js app — Google OAuth is configured entirely in Supabase.

### 5. AI assistant (optional)

Copy AI keys from `.env.local.example` into `.env.local`:

- `OPENROUTER_API_KEY` — required for chat
- `OPENROUTER_DEFAULT_MODEL` — model slug (e.g. `deepseek/deepseek-v4-flash`, `qwen/qwen-2.5-72b-instruct`)
- `LANGSMITH_TRACING` + `LANGSMITH_API_KEY` — optional observability

The AI panel is pinned between the form and live preview in the editor. The model is configured via `OPENROUTER_DEFAULT_MODEL` only (no in-app picker). Proposed edits appear as patch cards — click **Apply to resume** to load them into the editor.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests (Playwright) |

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/login`, `/signup` | Auth |
| `/dashboard` | Resume list |
| `/dashboard/resume/[id]` | Editor + live preview |
| `/dashboard/templates` | Template gallery |
| `/preview` | Dev preview with sample data |

## Migration from vanilla app

On first login, if a draft exists in `localStorage` (`resume-builder-draft`), you'll be prompted to import it to your account.

## Export

From the editor toolbar:

- **Import JSON** — load a `.json` resume file
- **Export JSON** — download canonical JSON
- **Export MD** — Resume 13.0-compatible Markdown
- **Export PDF** — client-side PDF from live preview
