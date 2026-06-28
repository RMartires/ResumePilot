export enum ResumeSection {
  Personal = "personal",
  Skills = "skills",
  Projects = "projects",
  Experience = "experience",
  Education = "education",
}

export const DEFAULT_SECTION_ORDER: ResumeSection[] = [
  ResumeSection.Personal,
  ResumeSection.Skills,
  ResumeSection.Projects,
  ResumeSection.Experience,
  ResumeSection.Education,
];

export const REQUIRED_SECTIONS = new Set<ResumeSection>([
  ResumeSection.Personal,
]);

export const SECTION_META: Record<
  ResumeSection,
  { title: string; subtitle: string }
> = {
  [ResumeSection.Personal]: {
    title: "Personal Info and Socials",
    subtitle: "Lets get to know you! Fill in your personal details",
  },
  [ResumeSection.Skills]: {
    title: "Skills",
    subtitle: "Add skills that match the job you are applying for",
  },
  [ResumeSection.Projects]: {
    title: "Projects",
    subtitle: "Showcase your best work and side projects",
  },
  [ResumeSection.Experience]: {
    title: "Experience",
    subtitle: "Add your work history and internships",
  },
  [ResumeSection.Education]: {
    title: "Education",
    subtitle: "Add your academic background",
  },
};

const VALID_SECTIONS = new Set<string>(Object.values(ResumeSection));

export function isResumeSection(value: string): value is ResumeSection {
  return VALID_SECTIONS.has(value);
}

export function normalizeActiveSections(raw: unknown): ResumeSection[] {
  const seen = new Set<ResumeSection>();
  const sections: ResumeSection[] = [];

  if (Array.isArray(raw)) {
    for (const item of raw) {
      const id = String(item);
      if (isResumeSection(id) && !seen.has(id)) {
        seen.add(id);
        sections.push(id);
      }
    }
  }

  const base =
    sections.length > 0 ? sections : [...DEFAULT_SECTION_ORDER];

  for (const required of REQUIRED_SECTIONS) {
    if (!base.includes(required)) {
      base.unshift(required);
    }
  }

  return sortSections(base);
}

export function sortSections(sections: ResumeSection[]): ResumeSection[] {
  return [...sections].sort(
    (a, b) =>
      DEFAULT_SECTION_ORDER.indexOf(a) - DEFAULT_SECTION_ORDER.indexOf(b),
  );
}

export function getAvailableSectionsToAdd(
  activeSections: ResumeSection[],
): ResumeSection[] {
  const active = new Set(activeSections);
  return DEFAULT_SECTION_ORDER.filter((section) => !active.has(section));
}

export function isSectionActive(
  activeSections: ResumeSection[],
  section: ResumeSection,
): boolean {
  return activeSections.includes(section);
}

export function canRemoveSection(section: ResumeSection): boolean {
  return !REQUIRED_SECTIONS.has(section);
}
