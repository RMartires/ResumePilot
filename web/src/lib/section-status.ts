import type { Resume } from "@/lib/validations/resume";
import { parseSkillsString } from "@/lib/skills";
import { ResumeSection } from "@/lib/sections";

export type SectionId = ResumeSection;

export type SectionStatus = {
  complete: boolean;
  label: string;
};

export function getSectionStatuses(
  resume: Resume,
  skillCount: number,
): Record<ResumeSection, SectionStatus> {
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
    [ResumeSection.Personal]: {
      complete: personalComplete,
      label: personalComplete ? "Looks Good ✓" : "Add your contact details",
    },
    [ResumeSection.Skills]: {
      complete: skillCount > 0,
      label:
        skillCount > 0 ? "Looks Good ✓" : "Add your technical skills",
    },
    [ResumeSection.Projects]: {
      complete: projectCount > 0,
      label:
        projectCount > 0
          ? `${projectCount} project${projectCount > 1 ? "s" : ""} added ✓`
          : "0 projects added",
    },
    [ResumeSection.Experience]: {
      complete: experienceCount > 0,
      label:
        experienceCount > 0
          ? `${experienceCount} role${experienceCount > 1 ? "s" : ""} added ✓`
          : "Add jobs and internships",
    },
    [ResumeSection.Education]: {
      complete: educationComplete,
      label: educationComplete ? "Looks Good ✓" : "Add academic background",
    },
  };
}

export function getSkillCountFromResume(resume: Resume): number {
  return parseSkillsString(resume.skills).length;
}
