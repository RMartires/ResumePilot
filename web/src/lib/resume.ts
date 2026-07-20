import type { Education, EducationEntry, Job, Project, Resume } from "@/lib/validations/resume";
import {
  DEFAULT_SECTION_ORDER,
  normalizeActiveSections,
  isSectionActive,
  ResumeSection,
} from "@/lib/sections";

export const STORAGE_KEY = "resume-builder-draft";

export function emptyJob(): Job {
  return {
    title: "",
    company: "",
    dates: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [""],
  };
}

export function emptyEducationEntry(): EducationEntry {
  return {
    school: "",
    degree: "",
    fieldOfStudy: "",
    year: "",
    graduationDate: "",
    marks: "",
    marksType: "CGPA",
    description: "",
  };
}

export function emptyProject(): Project {
  return { name: "", url: "", bullets: [""] };
}

export function emptyResume(): Resume {
  return {
    header: {
      name: "",
      location: "",
      phone: "",
      email: "",
      gender: "",
      links: [""],
    },
    summary: "",
    skills: "",
    experience: [emptyJob()],
    projects: [emptyProject()],
    education: {
      school: "",
      degree: "",
      fieldOfStudy: "",
      year: "",
      graduationDate: "",
      marks: "",
      marksType: "CGPA",
      description: "",
      secondary: [],
    },
    activeSections: [...DEFAULT_SECTION_ORDER],
  };
}

function normalizeEducationEntry(item: unknown): EducationEntry {
  const entry = emptyEducationEntry();
  const s = (item ?? {}) as Record<string, unknown>;

  entry.school = String(s.school ?? s.name ?? "");
  entry.degree = String(s.degree ?? "");
  entry.fieldOfStudy = String(s.fieldOfStudy ?? "");
  entry.year = String(s.year ?? "");
  entry.graduationDate = String(s.graduationDate ?? "");
  entry.marks = String(s.marks ?? "");
  entry.marksType = String(s.marksType ?? "CGPA") || "CGPA";
  entry.description = String(s.description ?? "");

  if (!entry.graduationDate && entry.year) {
    entry.graduationDate = /^\d{4}$/.test(entry.year)
      ? `${entry.year}-01-01`
      : entry.year;
  }

  return entry;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function coerceLinks(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((l) => String(l).trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[\n|,]+/)
      .map((l) => l.trim())
      .filter(Boolean);
  }
  return [];
}

function coerceSkills(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).join(" | ");
  }
  return "";
}

function coerceEducation(raw: unknown): Education {
  const empty = emptyResume().education;

  if (Array.isArray(raw) && raw.length > 0) {
    const [primary, ...rest] = raw;
    const first = normalizeEducationEntry(primary);
    return {
      ...first,
      secondary: rest.map((item) => normalizeEducationEntry(item)),
    };
  }

  const e = asRecord(raw);
  if (!e) return empty;

  return {
    school: String(e.school ?? e.name ?? ""),
    degree: String(e.degree ?? ""),
    fieldOfStudy: String(e.fieldOfStudy ?? ""),
    year: String(e.year ?? ""),
    graduationDate: String(e.graduationDate ?? ""),
    marks: String(e.marks ?? ""),
    marksType: String(e.marksType ?? "CGPA") || "CGPA",
    description: String(e.description ?? ""),
    secondary: Array.isArray(e.secondary)
      ? e.secondary.map((item) => normalizeEducationEntry(item))
      : [],
  };
}

export function normalizeResume(data: unknown): Resume {
  const base = emptyResume();

  let rawValue = data;
  if (typeof rawValue === "string") {
    try {
      rawValue = JSON.parse(rawValue) as unknown;
    } catch {
      return base;
    }
  }

  const raw = asRecord(rawValue);
  if (!raw) return base;

  // Some models nest under resume/data instead of returning the object directly.
  const nested = asRecord(raw.resume) ?? asRecord(raw.data);
  const source = nested && !asRecord(raw.header) ? nested : raw;

  const header = asRecord(source.header);
  if (header) {
    const links = coerceLinks(header.links);
    base.header = {
      name: String(header.name ?? ""),
      location: String(header.location ?? ""),
      phone: String(header.phone ?? ""),
      email: String(header.email ?? ""),
      gender: String(header.gender ?? ""),
      links: links.length > 0 ? links : [""],
    };
  }

  base.summary = String(source.summary ?? "");
  base.skills = coerceSkills(source.skills);

  if (Array.isArray(source.experience)) {
    base.experience = source.experience.map((job) => {
      const j = asRecord(job) ?? {};
      return {
        title: String(j.title ?? ""),
        company: String(j.company ?? ""),
        dates: String(j.dates ?? ""),
        location: String(j.location ?? ""),
        startDate: String(j.startDate ?? ""),
        endDate: String(j.endDate ?? ""),
        current: Boolean(j.current),
        bullets: Array.isArray(j.bullets)
          ? j.bullets.map((b) => String(b)).filter((b) => b.length > 0)
          : [""],
      };
    });
  }
  if (base.experience.length === 0) base.experience = [emptyJob()];

  if (Array.isArray(source.projects)) {
    base.projects = source.projects.map((project) => {
      const p = asRecord(project) ?? {};
      return {
        name: String(p.name ?? ""),
        url: String(p.url ?? ""),
        bullets: Array.isArray(p.bullets)
          ? p.bullets.map((b) => String(b)).filter((b) => b.length > 0)
          : [""],
      };
    });
  }
  if (base.projects.length === 0) base.projects = [emptyProject()];

  base.education = coerceEducation(source.education);
  if (!base.education.graduationDate && base.education.year) {
    base.education.graduationDate = /^\d{4}$/.test(base.education.year)
      ? `${base.education.year}-01-01`
      : base.education.year;
  }

  base.activeSections = normalizeActiveSections(source.activeSections);

  return base;
}

export function resumeToMarkdown(resume: Resume): string {
  const normalized = normalizeResume(resume);
  const links = normalized.header.links.filter(Boolean).join(" | ");
  const lines = [
    `# ${normalized.header.name || "Resume"} (generated from JSON)`,
    `# Edit in the resume builder, then export MD for PDF generation.`,
    "",
    "[header]",
    `name: ${normalized.header.name}`,
    `location: ${normalized.header.location}`,
    `phone: ${normalized.header.phone}`,
    `email: ${normalized.header.email}`,
    `links: ${links}`,
    "",
  ];

  if (isSectionActive(normalized.activeSections, ResumeSection.Personal)) {
    lines.push("[summary]", normalized.summary, "");
  }

  if (isSectionActive(normalized.activeSections, ResumeSection.Skills)) {
    lines.push("[skills]", normalized.skills, "");
  }

  if (isSectionActive(normalized.activeSections, ResumeSection.Experience)) {
    lines.push("[experience]");
    for (const job of normalized.experience) {
      if (!job.title && !job.company && job.bullets.every((b) => !b)) continue;
      lines.push(`title: ${job.title}`);
      lines.push(`company: ${job.company}`);
      lines.push(`dates: ${job.dates}`);
      lines.push("bullets:");
      for (const bullet of job.bullets.filter(Boolean)) {
        lines.push(`- ${bullet}`);
      }
      lines.push("");
    }
  }

  if (isSectionActive(normalized.activeSections, ResumeSection.Projects)) {
    lines.push("[projects]");
    for (const project of normalized.projects) {
      if (!project.name && !project.url && project.bullets.every((b) => !b)) {
        continue;
      }
      lines.push(`name: ${project.name}`);
      lines.push(`url: ${project.url}`);
      lines.push("bullets:");
      for (const bullet of project.bullets.filter(Boolean)) {
        lines.push(`- ${bullet}`);
      }
      lines.push("");
    }
  }

  if (isSectionActive(normalized.activeSections, ResumeSection.Education)) {
    lines.push("[education]");
    lines.push(`school: ${normalized.education.school}`);
    lines.push(`degree: ${normalized.education.degree}`);
    lines.push(`fieldOfStudy: ${normalized.education.fieldOfStudy}`);
    lines.push(`year: ${normalized.education.year}`);
    lines.push(`graduationDate: ${normalized.education.graduationDate}`);
    lines.push(`marks: ${normalized.education.marks}`);
    lines.push(`marksType: ${normalized.education.marksType}`);
    lines.push(`description: ${normalized.education.description}`);
    for (const item of normalized.education.secondary) {
      if (!item.school && !item.description && !item.degree) continue;
      lines.push("secondary:");
      lines.push(`school: ${item.school}`);
      lines.push(`degree: ${item.degree}`);
      lines.push(`fieldOfStudy: ${item.fieldOfStudy}`);
      lines.push(`year: ${item.year}`);
      lines.push(`graduationDate: ${item.graduationDate}`);
      lines.push(`marks: ${item.marks}`);
      lines.push(`marksType: ${item.marksType}`);
      lines.push(`description: ${item.description}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function resumeToJson(resume: Resume): Resume {
  const cleaned = normalizeResume(resume);
  cleaned.experience = cleaned.experience.map((job) => ({
    ...job,
    bullets: job.bullets.filter(Boolean),
  }));
  cleaned.projects = cleaned.projects.map((project) => ({
    ...project,
    bullets: project.bullets.filter(Boolean),
  }));
  cleaned.header.links = cleaned.header.links.filter(Boolean);
  cleaned.activeSections = normalizeActiveSections(cleaned.activeSections);
  return cleaned;
}

export function slugify(text: string): string {
  return (
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
    "resume"
  );
}

export function linkLabel(url: string): string {
  const cleaned = url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
  if (/^github\.com/i.test(cleaned)) return "GitHub";
  if (/^linkedin\.com/i.test(cleaned)) return "LinkedIn";
  return cleaned.split("/")[0] || url;
}
