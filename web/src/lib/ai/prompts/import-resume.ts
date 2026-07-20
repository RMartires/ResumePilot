import { DEFAULT_SECTION_ORDER } from "@/lib/sections";

const SECTION_ORDER = DEFAULT_SECTION_ORDER.join(", ");

export function buildImportResumeSystemPrompt(): string {
  return `You convert raw resume text extracted from a PDF into structured JSON for ResumeBuilder.

Return JSON with:
- title: short display title (usually the person's name)
- resume: the full resume object

Resume object shape:
{
  "header": {
    "name": string,
    "location": string,
    "phone": string,
    "email": string,
    "gender": string (optional, default ""),
    "links": string[] (URLs for LinkedIn, GitHub, portfolio, etc.)
  },
  "summary": string (professional summary paragraph),
  "skills": string (comma or pipe separated skill groups),
  "experience": [
    {
      "title": string,
      "company": string,
      "dates": string (human-readable range, e.g. "Jan 2020 - Present"),
      "location": string (optional),
      "startDate": string (optional, ISO or empty),
      "endDate": string (optional, ISO or empty),
      "current": boolean (optional),
      "bullets": string[]
    }
  ],
  "projects": [
    {
      "name": string,
      "url": string (use "" if unknown),
      "bullets": string[]
    }
  ],
  "education": {
    "school": string,
    "degree": string,
    "fieldOfStudy": string,
    "year": string,
    "graduationDate": string (ISO date or year),
    "marks": string,
    "marksType": string (e.g. "CGPA", "GPA", or ""),
    "description": string,
    "secondary": [] (additional education entries with same fields)
  },
  "activeSections": [${SECTION_ORDER.split(", ").map((s) => `"${s}"`).join(", ")}]
}

Rules:
- Preserve factual content from the PDF. Do not invent employers, dates, degrees, or metrics.
- Extract EVERY section present in the text: header (name, email, phone, location, links), summary, skills, experience, projects, and education.
- Email, LinkedIn, GitHub, and portfolio URLs are critical — copy them exactly when present in the PDF text.
- Put social/profile URLs in header.links as full https:// URLs (LinkedIn, GitHub, website, etc.).
- Use empty strings and empty arrays for missing sections instead of omitting keys.
- Split combined role descriptions into separate experience entries when clearly distinct jobs.
- Keep bullet points concise and faithful to the source wording.
- Normalize phone numbers and emails when present; leave blank if absent.
- If education lists multiple degrees, put the primary one in education and others in education.secondary.
- skills must be a single string (use " | " or commas between groups), never an array.`;
}
