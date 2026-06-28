# Resume Builder

A browser-based resume editor with **live preview**, **JSON as source of truth**, and **PDF export**. The primary app is now the **Next.js** version in [`web/`](web/) with Supabase auth, cloud sync, and templates.

> **Note:** The legacy vanilla app (`index.html` + `serve.py`) is deprecated. Use `web/` for all new development.

## Quick start (Next.js app)

**Requirements:** Node.js 20+, Supabase project

```bash
cd web
npm install
cp .env.local.example .env.local
# Add your Supabase URL and anon key
npm run dev
```

Open **http://localhost:3000**

See [`web/README.md`](web/README.md) for Supabase migration setup, routes, and scripts.

### Features (Next.js)

- **Accounts** — sign up / sign in via Supabase Auth
- **Dashboard** — create, duplicate, and manage multiple resumes
- **Visual editor** — timeline sections for personal info, skills, projects, experience, education
- **Live preview** — real-time resume rendering with template support
- **Templates** — Classic, Modern, and Compact layouts
- **Cloud autosave** — debounced save to Supabase (250 ms)
- **Import / export** — JSON, Markdown (Resume 13.0 format), and PDF
- **localStorage migration** — import drafts from the legacy editor on first login

## Legacy vanilla app (deprecated)

```bash
python3 serve.py
# Open http://localhost:8765/
```

The legacy app uses vanilla HTML/CSS/JS with `localStorage` autosave. It remains in the repo for reference but is no longer actively developed.

## Project structure

```
resume-builder/
├── web/                    # Next.js app (primary)
│   ├── src/
│   │   ├── app/            # Routes, API handlers
│   │   ├── components/     # Editor, preview, dashboard
│   │   └── lib/            # Resume logic (ported from js/)
│   └── package.json
├── supabase/
│   └── migrations/         # Postgres schema + RLS
├── schema/
│   └── resume.schema.json  # JSON Schema for resume documents
├── data/
│   └── sample-resume.json
├── index.html              # Legacy UI (deprecated)
├── js/                     # Legacy JS (deprecated)
├── css/                    # Legacy CSS (deprecated)
├── generate_from_json.py   # CLI: JSON → Markdown → PDF
└── serve.py                # Legacy static server
```

## JSON format

Resumes follow the schema in `schema/resume.schema.json`. Top-level keys:

| Section | Type | Description |
|---------|------|-------------|
| `header` | object | `name`, `location`, `phone`, `email`, `links[]` |
| `summary` | string | Professional summary |
| `skills` | string | Pipe-separated skill groups |
| `experience` | array | Jobs with `title`, `company`, `dates`, `bullets[]` |
| `projects` | array | Projects with `name`, `url`, `bullets[]` |
| `education` | object | Primary + `secondary[]` education entries |

## CLI: Generate PDF from JSON

```bash
python3 generate_from_json.py data/sample-resume.json output.pdf
```

See the legacy README sections in git history for Resume 13.0 integration details.

## Development

```bash
cd web
npm run test        # Unit tests (Vitest)
npm run test:e2e    # E2E tests (Playwright)
npm run build       # Production build
```

## License

See repository license file if present.
