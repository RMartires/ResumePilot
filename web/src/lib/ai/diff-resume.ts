import type { Resume } from "@/lib/validations/resume";

export type ResumeDiffItem = {
  section: string;
  change: "added" | "removed" | "modified";
  detail: string;
};

export type PreviewHighlightId =
  | "header"
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | `experience:${number}`
  | `project:${number}`;

export type PreviewHighlight = {
  id: PreviewHighlightId;
  change: "added" | "removed" | "modified";
};

function norm(s: string) {
  return s.trim();
}

export function computePreviewHighlights(
  before: Resume,
  after: Resume,
): PreviewHighlight[] {
  const highlights: PreviewHighlight[] = [];

  const headerChanged =
    norm(before.header.name) !== norm(after.header.name) ||
    norm(before.header.location) !== norm(after.header.location) ||
    norm(before.header.phone) !== norm(after.header.phone) ||
    norm(before.header.email) !== norm(after.header.email) ||
    JSON.stringify(before.header.links) !== JSON.stringify(after.header.links);

  if (headerChanged) {
    highlights.push({ id: "header", change: "modified" });
  }

  if (norm(before.summary) !== norm(after.summary)) {
    highlights.push({
      id: "summary",
      change: norm(before.summary) ? "modified" : "added",
    });
  }

  if (norm(before.skills) !== norm(after.skills)) {
    highlights.push({
      id: "skills",
      change: norm(before.skills) ? "modified" : "added",
    });
  }

  const beforeJobs = before.experience.filter((j) => j.title || j.company);
  const afterJobs = after.experience.filter((j) => j.title || j.company);

  for (let i = 0; i < afterJobs.length; i += 1) {
    const job = afterJobs[i]!;
    const match = beforeJobs.find(
      (b) => b.title === job.title && b.company === job.company,
    );
    if (!match) {
      highlights.push({ id: `experience:${i}`, change: "added" });
    } else if (JSON.stringify(match) !== JSON.stringify(job)) {
      highlights.push({ id: `experience:${i}`, change: "modified" });
    }
  }

  if (highlights.some((h) => h.id.startsWith("experience:"))) {
    highlights.push({ id: "experience", change: "modified" });
  }

  const beforeProjects = before.projects.filter((p) => p.name);
  const afterProjects = after.projects.filter((p) => p.name);

  for (let i = 0; i < afterProjects.length; i += 1) {
    const project = afterProjects[i]!;
    const prev = beforeProjects.find((b) => b.name === project.name);
    if (!prev) {
      highlights.push({ id: `project:${i}`, change: "added" });
    } else if (JSON.stringify(prev) !== JSON.stringify(project)) {
      highlights.push({ id: `project:${i}`, change: "modified" });
    }
  }

  if (highlights.some((h) => h.id.startsWith("project:"))) {
    highlights.push({ id: "projects", change: "modified" });
  }

  if (
    norm(before.education.school) !== norm(after.education.school) ||
    norm(before.education.degree) !== norm(after.education.degree) ||
    norm(before.education.description) !== norm(after.education.description) ||
    JSON.stringify(before.education.secondary) !==
      JSON.stringify(after.education.secondary)
  ) {
    highlights.push({ id: "education", change: "modified" });
  }

  return highlights;
}

export function isHighlightActive(
  highlights: PreviewHighlight[],
  id: PreviewHighlightId,
): PreviewHighlight | undefined {
  return highlights.find((item) => item.id === id);
}

export function computeResumeDiff(
  before: Resume,
  after: Resume,
): ResumeDiffItem[] {
  const diffs: ResumeDiffItem[] = [];

  if (norm(before.summary) !== norm(after.summary)) {
    diffs.push({
      section: "Summary",
      change: "modified",
      detail: "Professional summary updated",
    });
  }

  if (norm(before.skills) !== norm(after.skills)) {
    diffs.push({
      section: "Skills",
      change: "modified",
      detail: "Skills section updated",
    });
  }

  const headerFields: Array<[string, "name" | "location" | "phone" | "email"]> = [
    ["Name", "name"],
    ["Location", "location"],
    ["Phone", "phone"],
    ["Email", "email"],
  ];

  for (const [label, key] of headerFields) {
    if (norm(before.header[key]) !== norm(after.header[key])) {
      diffs.push({
        section: "Header",
        change: "modified",
        detail: `${label}: "${before.header[key] || "—"}" → "${after.header[key] || "—"}"`,
      });
    }
  }

  const beforeJobs = before.experience.filter((j) => j.title || j.company);
  const afterJobs = after.experience.filter((j) => j.title || j.company);

  for (const job of afterJobs) {
    const match = beforeJobs.find(
      (b) => b.title === job.title && b.company === job.company,
    );
    if (!match) {
      diffs.push({
        section: "Experience",
        change: "added",
        detail: `${job.title} at ${job.company}`,
      });
    } else if (JSON.stringify(match) !== JSON.stringify(job)) {
      diffs.push({
        section: "Experience",
        change: "modified",
        detail: `${job.title} at ${job.company}`,
      });
    }
  }

  for (const job of beforeJobs) {
    const still = afterJobs.some(
      (a) => a.title === job.title && a.company === job.company,
    );
    if (!still) {
      diffs.push({
        section: "Experience",
        change: "removed",
        detail: `${job.title} at ${job.company}`,
      });
    }
  }

  const beforeProjects = before.projects.filter((p) => p.name);
  const afterProjects = after.projects.filter((p) => p.name);

  for (const project of afterProjects) {
    if (!beforeProjects.some((b) => b.name === project.name)) {
      diffs.push({
        section: "Projects",
        change: "added",
        detail: project.name,
      });
    } else {
      const prev = beforeProjects.find((b) => b.name === project.name)!;
      if (JSON.stringify(prev) !== JSON.stringify(project)) {
        diffs.push({
          section: "Projects",
          change: "modified",
          detail: project.name,
        });
      }
    }
  }

  for (const project of beforeProjects) {
    if (!afterProjects.some((a) => a.name === project.name)) {
      diffs.push({
        section: "Projects",
        change: "removed",
        detail: project.name,
      });
    }
  }

  if (
    norm(before.education.school) !== norm(after.education.school) ||
    norm(before.education.degree) !== norm(after.education.degree)
  ) {
    diffs.push({
      section: "Education",
      change: "modified",
      detail: "Primary education updated",
    });
  }

  if (JSON.stringify(before) === JSON.stringify(after)) {
    return [];
  }

  if (
    diffs.length === 0 &&
    JSON.stringify(before) !== JSON.stringify(after)
  ) {
    diffs.push({
      section: "Resume",
      change: "modified",
      detail: "Multiple sections updated",
    });
  }

  return diffs;
}
