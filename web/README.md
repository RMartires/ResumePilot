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

Sign up at `/signup`, then create resumes from the dashboard.

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
