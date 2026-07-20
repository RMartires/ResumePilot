import { emptyResume, normalizeResume, resumeToJson } from "@/lib/resume";
import type { Job, Resume } from "@/lib/validations/resume";
import { DEFAULT_SECTION_ORDER } from "@/lib/sections";

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/;
const URL_RE = /https?:\/\/[^\s)|,]+|www\.[^\s)|,]+/gi;
const SECTION_RE =
  /\b(PROFESSIONAL\s+SUMMARY|SUMMARY|PROFILE|OBJECTIVE|SKILLS|EXPERIENCE|WORK\s+EXPERIENCE|EMPLOYMENT|PROJECTS|EDUCATION|QUALIFICATIONS)\b/g;

const MONTH_YEAR_RE =
  /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}/i;
const DATE_RANGE_RE = new RegExp(
  `${MONTH_YEAR_RE.source}\\s*[-–—to]+\\s*(?:${MONTH_YEAR_RE.source}|Present|Current|Now)`,
  "i",
);

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function splitSections(text: string): Map<string, string> {
  const sections = new Map<string, string>();
  const matches = [...text.matchAll(SECTION_RE)];
  if (matches.length === 0) {
    sections.set("body", text);
    return sections;
  }

  const preamble = text.slice(0, matches[0].index).trim();
  if (preamble) sections.set("header", preamble);

  for (let i = 0; i < matches.length; i++) {
    const label = matches[i][1].toUpperCase().replace(/\s+/g, " ");
    const start = (matches[i].index ?? 0) + matches[i][0].length;
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;
    const key =
      label.includes("SUMMARY") || label.includes("PROFILE") || label.includes("OBJECTIVE")
        ? "summary"
        : label.includes("SKILL")
          ? "skills"
          : label.includes("EXPERIENCE") || label.includes("EMPLOYMENT")
            ? "experience"
            : label.includes("PROJECT")
              ? "projects"
              : label.includes("EDUCATION") || label.includes("QUALIFICATION")
                ? "education"
                : label.toLowerCase();
    sections.set(key, text.slice(start, end).trim());
  }

  return sections;
}

function extractLinks(text: string): string[] {
  const matches = text.match(URL_RE) ?? [];
  return [...new Set(matches.map((url) => (url.startsWith("http") ? url : `https://${url}`)))];
}

function parseExperience(block: string): Job[] {
  if (!block.trim()) return [];

  const jobs: Job[] = [];
  const ranges = [...block.matchAll(new RegExp(DATE_RANGE_RE, "gi"))];
  if (ranges.length === 0) {
    return [
      {
        title: "",
        company: "",
        dates: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        bullets: block
          .split(/\s[-•]\s/)
          .map((b) => b.trim())
          .filter((b) => b.length > 8),
      },
    ];
  }

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const rangeStart = range.index ?? 0;
    const prevEnd =
      i === 0 ? 0 : (ranges[i - 1].index ?? 0) + ranges[i - 1][0].length;
    const nextStart =
      i + 1 < ranges.length ? (ranges[i + 1].index ?? block.length) : block.length;

    const before = block.slice(prevEnd, rangeStart).trim();
    const after = block.slice(rangeStart + range[0].length, nextStart).trim();
    const beforeParts = before
      .split(/\s[-–—]\s/)
      .map((p) => p.trim())
      .filter(Boolean);

    let title = "";
    let company = "";
    if (beforeParts.length >= 2) {
      company = beforeParts[beforeParts.length - 1] ?? "";
      title = beforeParts.slice(0, -1).join(" - ");
    } else if (beforeParts.length === 1) {
      // "Customer service (volunteer) ... Park Hill Soccer Club Canteen"
      const tokens = beforeParts[0].split(/\s{2,}|\s-\s/);
      title = tokens[0] ?? beforeParts[0];
      company = tokens.slice(1).join(" ").trim();
      if (!company) {
        const companyMatch = beforeParts[0].match(
          /(.+?)\s+([A-Z][\w\s&]+(?:Club|Canteen|Agency|Newsagency|College|Company|Inc|Ltd|LLC).*)/i,
        );
        if (companyMatch) {
          title = companyMatch[1].trim();
          company = companyMatch[2].trim();
        }
      }
    }

    const bullets = after
      .split(/\s[-•]\s|(?<=\.)\s+(?=[A-Z])/)
      .map((b) => b.replace(/^[-•]\s*/, "").trim())
      .filter((b) => b.length > 3 && !DATE_RANGE_RE.test(b));

    jobs.push({
      title: normalizeWhitespace(title),
      company: normalizeWhitespace(company),
      dates: normalizeWhitespace(range[0]),
      location: "",
      startDate: "",
      endDate: "",
      current: /present|current|now/i.test(range[0]),
      bullets: bullets.length > 0 ? bullets : [""],
    });
  }

  return jobs.filter((job) => job.title || job.company || job.bullets.some(Boolean));
}

function parseEducation(block: string): Resume["education"] {
  const empty = emptyResume().education;
  if (!block.trim()) return empty;

  const yearMatch = block.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch?.[0] ?? "";
  const schoolMatch =
    block.match(
      /([A-Z][^.]{3,80}?(?:College|University|School|Institute|Academy)[^.]{0,40})/i,
    ) ?? null;

  return {
    ...empty,
    school: normalizeWhitespace(schoolMatch?.[1] ?? block.slice(0, 80)),
    degree: /year\s+\d+/i.test(block)
      ? normalizeWhitespace(block.match(/year\s+\d+/i)?.[0] ?? "")
      : "",
    fieldOfStudy: "",
    year,
    graduationDate: year ? `${year}-01-01` : "",
    description: normalizeWhitespace(block),
  };
}

export type HeuristicParseResult = {
  resume: Resume;
  title: string;
  /** True when contact + at least one content section look usable. */
  confident: boolean;
};

/**
 * Deterministic resume parse from extracted PDF text (no LLM).
 * Fast path for section-labeled text resumes.
 */
export function parseResumeFromText(rawText: string): HeuristicParseResult {
  const text = normalizeWhitespace(rawText);
  const sections = splitSections(text);
  const headerText = sections.get("header") ?? text.slice(0, 280);

  const email = headerText.match(EMAIL_RE)?.[0] ?? text.match(EMAIL_RE)?.[0] ?? "";
  const phone =
    headerText.match(PHONE_RE)?.[0]?.trim() ??
    text.match(PHONE_RE)?.[0]?.trim() ??
    "";
  const links = extractLinks(text);

  let name = "";
  const beforeContact = headerText
    .split(email || phone || "·")[0]
    ?.replace(/[·|].*$/, "")
    .trim();
  if (beforeContact) {
    const nameCandidate = beforeContact
      .replace(PHONE_RE, "")
      .replace(/\d{3,}.*/, "")
      .trim();
    // Prefer 2–4 capitalized words at the start.
    const m = nameCandidate.match(
      /^([A-Z][A-Za-z'’-]+(?:\s+[A-Z][A-Za-z'’-]+){0,3})/,
    );
    name = m?.[1] ?? nameCandidate.slice(0, 60);
  }

  const locationParts = headerText
    .replace(email, "")
    .replace(phone, "")
    .replace(name, "")
    .split(/[·|]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 2 && !EMAIL_RE.test(p) && !PHONE_RE.test(p));
  const location = locationParts[0] ?? "";

  const base = emptyResume();
  base.header = {
    name: normalizeWhitespace(name),
    location: normalizeWhitespace(location),
    phone: normalizeWhitespace(phone),
    email,
    gender: "",
    links: links.length > 0 ? links : [""],
  };
  base.summary = sections.get("summary") ?? "";
  base.skills = sections.get("skills") ?? "";
  base.experience = parseExperience(sections.get("experience") ?? "");
  if (base.experience.length === 0) base.experience = emptyResume().experience;
  base.education = parseEducation(sections.get("education") ?? "");
  base.activeSections = [...DEFAULT_SECTION_ORDER];

  const resume = resumeToJson(normalizeResume(base));
  const hasJobs = resume.experience.some((j) => j.title || j.company);
  const hasEducation = Boolean(resume.education.school.trim());
  const confident =
    Boolean(resume.header.name.trim()) &&
    (Boolean(resume.header.email.trim()) || Boolean(resume.header.phone.trim())) &&
    (hasJobs || hasEducation || Boolean(resume.summary.trim()));

  return {
    resume,
    title: resume.header.name.trim() || "Imported Resume",
    confident,
  };
}
