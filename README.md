# Resume Builder

Visual resume editor that stores content as **JSON** and plugs into the existing **Resume 13.0** Markdown → PDF pipeline.

## How Resume 13.0 works

In `../Resume_13.0/`:

1. Edit a structured Markdown file (`rohit_martires_resume.md`) with labeled sections: `[header]`, `[summary]`, `[skills]`, etc.
2. Run `python3 generate_pdf.py`
3. The script parses MD → HTML → PDF (via headless Chrome) and writes `resume.preview.html`

## This project

| File | Purpose |
|------|---------|
| `index.html` | Resume builder UI |
| `js/app.js` | Form logic, preview, save/load |
| `js/resume.js` | JSON schema helpers, MD export |
| `data/sample-resume.json` | Starter resume data |
| `schema/resume.schema.json` | JSON schema |
| `generate_from_json.py` | JSON → MD → PDF bridge |
| `serve.py` | Local dev server |

## Quick start

```bash
cd New_Resume
python3 serve.py
```

Open **http://localhost:8765/** in your browser.

- Edit sections in the left panel
- Live preview + JSON output on the right
- Draft auto-saves to browser localStorage
- **Save JSON** downloads `your-name.json`
- **Export MD** downloads Markdown compatible with Resume 13.0
- **Load JSON** imports a saved file

## Generate PDF from JSON

```bash
python3 generate_from_json.py data/sample-resume.json output.pdf
```

This writes a `.md` file next to the JSON and calls `../Resume_13.0/generate_pdf.py` to produce the PDF.

Or export MD from the UI and run:

```bash
python3 ../Resume_13.0/generate_pdf.py your-resume.md your-resume.pdf
```

## JSON format

```json
{
  "header": {
    "name": "...",
    "location": "...",
    "phone": "...",
    "email": "...",
    "links": ["https://github.com/you"]
  },
  "summary": "...",
  "skills": "Backend: Node.js | Data: PostgreSQL",
  "experience": [
    {
      "title": "Senior Engineer",
      "company": "Acme",
      "dates": "2023 - Present",
      "bullets": ["Built X achieving Y"]
    }
  ],
  "projects": [
    {
      "name": "Project",
      "url": "https://github.com/you/project",
      "bullets": ["Description"]
    }
  ],
  "education": {
    "school": "University",
    "degree": "B.Tech",
    "year": "2020"
  }
}
```

## Workflow

1. Build/edit resume in the UI
2. Save JSON as source of truth
3. Export MD or run `generate_from_json.py` when you need a PDF for applications
