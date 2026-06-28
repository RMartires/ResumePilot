import type { EducationEntry, Job, Project, Resume } from "@/lib/validations/resume";
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

export function normalizeResume(data: unknown): Resume {
  const base = emptyResume();
  if (!data || typeof data !== "object") return base;

  const raw = data as Record<string, unknown>;

  if (raw.header && typeof raw.header === "object") {
    const h = raw.header as Record<string, unknown>;
    base.header = {
      name: String(h.name ?? ""),
      location: String(h.location ?? ""),
      phone: String(h.phone ?? ""),
      email: String(h.email ?? ""),
      gender: String(h.gender ?? ""),
      links: Array.isArray(h.links)
        ? h.links.map((l) => String(l)).filter(Boolean)
        : [""],
    };
    if (base.header.links.length === 0) base.header.links = [""];
  }

  base.summary = String(raw.summary ?? "");
  base.skills = String(raw.skills ?? "");

  if (Array.isArray(raw.experience)) {
    base.experience = raw.experience.map((job) => {
      const j = (job ?? {}) as Record<string, unknown>;
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

  if (Array.isArray(raw.projects)) {
    base.projects = raw.projects.map((project) => {
      const p = (project ?? {}) as Record<string, unknown>;
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

  if (raw.education && typeof raw.education === "object") {
    const e = raw.education as Record<string, unknown>;
    base.education = {
      school: String(e.school ?? ""),
      degree: String(e.degree ?? ""),
      fieldOfStudy: String(e.fieldOfStudy ?? ""),
      year: String(e.year ?? ""),
      graduationDate: String(e.graduationDate ?? ""),
      marks: String(e.marks ?? ""),
      marksType: String(e.marksType ?? "CGPA"),
      description: String(e.description ?? ""),
      secondary: Array.isArray(e.secondary)
        ? e.secondary.map((item) => normalizeEducationEntry(item))
        : [],
    };
    if (!base.education.graduationDate && base.education.year) {
      base.education.graduationDate = `${base.education.year}-01-01`;
    }
  }

  base.activeSections = normalizeActiveSections(raw.activeSections);

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
