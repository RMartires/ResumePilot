import type { Resume } from "@/lib/validations/resume";

export type ResumeDiffItem = {
  section: string;
  change: "added" | "removed" | "modified";
  detail: string;
};

function norm(s: string) {
  return s.trim();
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
