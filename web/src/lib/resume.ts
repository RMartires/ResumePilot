import type { EducationEntry, Job, Project, Resume } from "@/lib/validations/resume";

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

  return base;
}

export function resumeToMarkdown(resume: Resume): string {
  const links = resume.header.links.filter(Boolean).join(" | ");
  const lines = [
    `# ${resume.header.name || "Resume"} (generated from JSON)`,
    `# Edit in the resume builder, then export MD for PDF generation.`,
    "",
    "[header]",
    `name: ${resume.header.name}`,
    `location: ${resume.header.location}`,
    `phone: ${resume.header.phone}`,
    `email: ${resume.header.email}`,
    `links: ${links}`,
    "",
    "[summary]",
    resume.summary,
    "",
    "[skills]",
    resume.skills,
    "",
    "[experience]",
  ];

  for (const job of resume.experience) {
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

  lines.push("[projects]");
  for (const project of resume.projects) {
    if (!project.name && !project.url && project.bullets.every((b) => !b)) continue;
    lines.push(`name: ${project.name}`);
    lines.push(`url: ${project.url}`);
    lines.push("bullets:");
    for (const bullet of project.bullets.filter(Boolean)) {
      lines.push(`- ${bullet}`);
    }
    lines.push("");
  }

  lines.push("[education]");
  lines.push(`school: ${resume.education.school}`);
  lines.push(`degree: ${resume.education.degree}`);
  lines.push(`fieldOfStudy: ${resume.education.fieldOfStudy}`);
  lines.push(`year: ${resume.education.year}`);
  lines.push(`graduationDate: ${resume.education.graduationDate}`);
  lines.push(`marks: ${resume.education.marks}`);
  lines.push(`marksType: ${resume.education.marksType}`);
  lines.push(`description: ${resume.education.description}`);
  for (const item of resume.education.secondary) {
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
