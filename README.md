# Resume Builder

A lightweight, browser-based resume editor that stores content as **JSON** and exports to **Markdown** for PDF generation. No build step, no npm — just HTML, CSS, and vanilla JavaScript ES modules, plus two small Python scripts for local serving and CLI export.

## Features

- **Visual editor** — form-based UI for header, summary, skills, experience, projects, and education
- **Live preview** — resume renders in real time as you type
- **JSON as source of truth** — structured data with a formal JSON Schema (`schema/resume.schema.json`)
- **Auto-save** — drafts persist in browser `localStorage`
- **Import / export** — load JSON files, download JSON, or export Resume 13.0–compatible Markdown
- **CLI bridge** — convert JSON → Markdown → PDF from the command line (when [Resume 13.0](#resume-130-integration) is available)

## Quick start

**Requirements:** Python 3 (for the local dev server)

```bash
git clone <repo-url>
cd resume-builder
python3 serve.py
```

Open **http://localhost:8765/** in your browser.

Use a custom port:

```bash
python3 serve.py 9000
```

> A local server is required because the app uses ES modules and fetches `data/sample-resume.json`. Opening `index.html` directly from the filesystem will not work reliably.

### In the UI

| Action | What it does |
|--------|----------------|
| Edit sections (left panel) | Updates live preview and JSON output |
| **Load sample** | Loads `data/sample-resume.json` |
| **Load JSON** | Imports a saved `.json` resume file |
| **Save JSON** | Downloads `{your-name}.json` |
| **Export MD** | Downloads Markdown compatible with Resume 13.0 |

Drafts auto-save to `localStorage` every 250 ms while you edit.

## Project structure

```
resume-builder/
├── index.html              # Main UI (editor + preview layout)
├── css/
│   └── styles.css          # Layout, form, and preview styling
├── js/
│   ├── app.js              # Form logic, preview rendering, event handlers
│   └── resume.js           # Data model, normalization, MD/JSON export, localStorage
├── data/
│   └── sample-resume.json  # Example resume (Rohit Martires)
├── schema/
│   └── resume.schema.json  # JSON Schema (draft 2020-12) for resume documents
├── generate_from_json.py   # CLI: JSON → Markdown → PDF (optional)
├── serve.py                # Local static file server (port 8765)
├── .env.example            # Placeholder for future Stitch API integration
└── README.md
```

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Browser UI     │────▶│  resume.js       │────▶│  JSON file      │
│  (index.html)   │     │  normalize/export│     │  (source of     │
└─────────────────┘     └──────────────────┘     │   truth)        │
         │                        │               └────────┬────────┘
         │                        ▼                        │
         │               localStorage draft                │
         │                        │                        ▼
         │                        ▼               ┌─────────────────┐
         └───────────────▶ Markdown (.md) ◀──────│ generate_from_  │
                          (Resume 13.0 format)    │ json.py (CLI)   │
                                   │              └─────────────────┘
                                   ▼
                          ┌─────────────────┐
                          │ Resume 13.0     │
                          │ generate_pdf.py │
                          └────────┬────────┘
                                   ▼
                              PDF output
```

**Frontend:** Vanilla JS modules. `app.js` handles the DOM and user interactions; `resume.js` owns the data layer — empty templates, normalization of imported JSON, Markdown serialization, and file downloads.

**Backend:** None. Python scripts are dev/CLI utilities only.

## JSON format

Resumes follow the schema in `schema/resume.schema.json`. Top-level keys:

| Section | Type | Description |
|---------|------|-------------|
| `header` | object | `name`, `location`, `phone`, `email`, `links[]` |
| `summary` | string | Professional summary (1–2 lines) |
| `skills` | string | Pipe-separated skill groups, e.g. `Backend: Node.js \| Data: PostgreSQL` |
| `experience` | array | Jobs with `title`, `company`, `dates`, `bullets[]` |
| `projects` | array | Projects with `name`, `url`, `bullets[]` |
| `education` | object | `school`, `degree`, `year` |

Example:

```json
{
  "header": {
    "name": "Jane Doe",
    "location": "San Francisco, CA",
    "phone": "+1-555-0100",
    "email": "jane@example.com",
    "links": ["https://github.com/janedoe"]
  },
  "summary": "Backend engineer with 5+ years building scalable APIs.",
  "skills": "Backend: Node.js, Python | Data: PostgreSQL, Redis",
  "experience": [
    {
      "title": "Senior Engineer",
      "company": "Acme Corp",
      "dates": "2023 - Present",
      "bullets": ["Built X achieving Y metric"]
    }
  ],
  "projects": [
    {
      "name": "Side Project",
      "url": "https://github.com/janedoe/project",
      "bullets": ["Description of the project"]
    }
  ],
  "education": {
    "school": "State University",
    "degree": "B.S. Computer Science",
    "year": "2020"
  }
}
```

## Generate PDF from JSON

### Option A — CLI bridge

```bash
python3 generate_from_json.py data/sample-resume.json output.pdf
```

This writes a `.md` file next to the JSON and, if Resume 13.0 is installed, calls its PDF generator.

Markdown only (no PDF):

```bash
python3 generate_from_json.py data/sample-resume.json
# writes data/sample-resume.md
```

### Option B — UI export + manual PDF

1. Click **Export MD** in the browser
2. Run Resume 13.0's generator on the downloaded file:

```bash
python3 /path/to/Resume_13.0/generate_pdf.py your-resume.md your-resume.pdf
```

## Resume 13.0 integration

This project is designed to plug into the **Resume 13.0** Markdown → PDF pipeline (a separate repo/tool). Resume 13.0 expects structured Markdown with labeled sections:

```
[header]
name: ...
location: ...

[summary]
...

[skills]
...

[experience]
title: ...
company: ...
dates: ...
bullets:
- Built X

[projects]
...

[education]
...
```

Both the browser **Export MD** button and `generate_from_json.py` produce this format.

Resume 13.0 is **not bundled** with this repo. Install it as a sibling directory or pass the path manually:

```
/path/to/
├── resume-builder/     ← this repo
└── Resume_13.0/        ← expected at ../Resume_13.0 for CLI PDF generation
    └── generate_pdf.py
```

If `../Resume_13.0/generate_pdf.py` is missing, JSON → Markdown still works; only automated PDF generation is skipped.

## Recommended workflow

1. **Build** — edit your resume in the web UI
2. **Save** — download JSON as your canonical source file (e.g. `jane-doe.json`)
3. **Version control** — commit JSON to git; keep personal drafts out of the repo if preferred
4. **Export** — when applying, export MD or run `generate_from_json.py` to produce a PDF

## Development notes

- **No dependencies** — no `package.json`, no pip requirements; Python 3 stdlib only
- **JSDoc types** — `resume.js` and `app.js` use JSDoc for type hints (no TypeScript build)
- **Gitignored artifacts** — `*.pdf`, `data/*.md`, `.env`, `.stitch/`
- **`.env.example`** — placeholder for a future [Google Stitch](https://stitch.withgoogle.com) API key; not used by current code

## License

See repository license file if present.
