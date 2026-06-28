import type { Resume } from "@/lib/validations/resume";
import { parseSkillsString } from "@/lib/skills";

export const SECTION_ORDER = [
  "personal",
  "skills",
  "projects",
  "experience",
  "education",
] as const;

export type SectionId = (typeof SECTION_ORDER)[number];

export type SectionStatus = {
  complete: boolean;
  label: string;
};

export function getSectionStatuses(
  resume: Resume,
  skillCount: number,
): Record<SectionId, SectionStatus> {
  const personalComplete = Boolean(
    resume.header.name &&
      resume.header.email &&
      resume.header.links.some((l) => /linkedin\.com/i.test(l)),
  );

  const projectCount = resume.projects.filter(
    (p) => p.name || p.bullets.some(Boolean),
  ).length;

  const experienceCount = resume.experience.filter(
    (j) => j.company && j.bullets.some(Boolean),
  ).length;

  const educationComplete = Boolean(resume.education.school);

  return {
    personal: {
      complete: personalComplete,
      label: personalComplete ? "Looks Good ✓" : "Add your contact details",
    },
    skills: {
      complete: skillCount > 0,
      label:
        skillCount > 0 ? "Looks Good ✓" : "Add your technical skills",
    },
    projects: {
      complete: projectCount > 0,
      label:
        projectCount > 0
          ? `${projectCount} project${projectCount > 1 ? "s" : ""} added ✓`
          : "0 projects added",
    },
    experience: {
      complete: experienceCount > 0,
      label:
        experienceCount > 0
          ? `${experienceCount} role${experienceCount > 1 ? "s" : ""} added ✓`
          : "Add jobs and internships",
    },
    education: {
      complete: educationComplete,
      label: educationComplete ? "Looks Good ✓" : "Add academic background",
    },
  };
}

export function getSkillCountFromResume(resume: Resume): number {
  return parseSkillsString(resume.skills).length;
}
