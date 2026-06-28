/** @typedef {{ name: string, location: string, phone: string, email: string, gender: string, links: string[] }} Header */
/** @typedef {{ title: string, company: string, dates: string, location: string, startDate: string, endDate: string, current: boolean, bullets: string[] }} Job */
/** @typedef {{ name: string, url: string, bullets: string[] }} Project */
/** @typedef {{ school: string, degree: string, fieldOfStudy: string, year: string, graduationDate: string, marks: string, marksType: string, description: string }} EducationEntry */
/** @typedef {{ school: string, degree: string, fieldOfStudy: string, year: string, graduationDate: string, marks: string, marksType: string, description: string, secondary: EducationEntry[] }} Education */
/** @typedef {{ header: Header, summary: string, skills: string, experience: Job[], projects: Project[], education: Education }} Resume */

export const STORAGE_KEY = "resume-builder-draft";

/** @returns {Resume} */
export function emptyResume() {
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

/** @returns {Job} */
export function emptyJob() {
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

/** @returns {EducationEntry} */
export function emptyEducationEntry() {
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

/** @returns {Project} */
export function emptyProject() {
  return { name: "", url: "", bullets: [""] };
}

/** @param {unknown} data */
export function normalizeResume(data) {
  const base = emptyResume();
  if (!data || typeof data !== "object") return base;

  const raw = /** @type {Record<string, unknown>} */ (data);

  if (raw.header && typeof raw.header === "object") {
    const h = /** @type {Record<string, unknown>} */ (raw.header);
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
      const j = /** @type {Record<string, unknown>} */ (job ?? {});
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
      const p = /** @type {Record<string, unknown>} */ (project ?? {});
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
    const e = /** @type {Record<string, unknown>} */ (raw.education);
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

/** @param {unknown} item */
function normalizeEducationEntry(item) {
  const entry = emptyEducationEntry();
  const s = /** @type {Record<string, unknown>} */ (item ?? {});

  entry.school = String(s.school ?? s.name ?? "");
  entry.degree = String(s.degree ?? "");
  entry.fieldOfStudy = String(s.fieldOfStudy ?? "");
  entry.year = String(s.year ?? "");
  entry.graduationDate = String(s.graduationDate ?? "");
  entry.marks = String(s.marks ?? "");
  entry.marksType = String(s.marksType ?? "CGPA") || "CGPA";
  entry.description = String(s.description ?? "");

  if (!entry.graduationDate && entry.year) {
    entry.graduationDate = /^\d{4}$/.test(entry.year) ? `${entry.year}-01-01` : entry.year;
  }

  return entry;
}

/** @param {Resume} resume */
export function resumeToMarkdown(resume) {
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

/** @param {Resume} resume */
export function resumeToJson(resume) {
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

/** @param {Resume} resume */
export function saveDraft(resume) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeToJson(resume)));
}

/** @returns {Resume | null} */
export function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return normalizeResume(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** @param {Resume} resume @param {string} filename */
export function downloadJson(resume, filename = "resume.json") {
  const blob = new Blob([JSON.stringify(resumeToJson(resume), null, 2)], {
    type: "application/json",
  });
  triggerDownload(blob, filename);
}

/** @param {Resume} resume @param {string} filename */
export function downloadMarkdown(resume, filename = "resume.md") {
  const blob = new Blob([resumeToMarkdown(resume)], { type: "text/markdown" });
  triggerDownload(blob, filename);
}

/** @param {Blob} blob @param {string} filename */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
