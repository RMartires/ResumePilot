import { describe, expect, it } from "vitest";
import {
  DEFAULT_SECTION_ORDER,
  getAvailableSectionsToAdd,
  normalizeActiveSections,
  ResumeSection,
  sortSections,
} from "@/lib/sections";

describe("sections", () => {
  it("defaults to all sections when missing", () => {
    expect(normalizeActiveSections(undefined)).toEqual(DEFAULT_SECTION_ORDER);
  });

  it("deduplicates active sections", () => {
    expect(
      normalizeActiveSections([
        ResumeSection.Skills,
        ResumeSection.Skills,
        ResumeSection.Experience,
      ]),
    ).toEqual([
      ResumeSection.Personal,
      ResumeSection.Skills,
      ResumeSection.Experience,
    ]);
  });

  it("always includes required personal section", () => {
    expect(
      normalizeActiveSections([ResumeSection.Skills, ResumeSection.Projects]),
    ).toContain(ResumeSection.Personal);
  });

  it("lists only inactive sections to add", () => {
    expect(
      getAvailableSectionsToAdd([
        ResumeSection.Personal,
        ResumeSection.Skills,
      ]),
    ).toEqual([
      ResumeSection.Projects,
      ResumeSection.Experience,
      ResumeSection.Education,
    ]);
  });

  it("sorts sections in default order", () => {
    expect(
      sortSections([
        ResumeSection.Education,
        ResumeSection.Personal,
        ResumeSection.Projects,
      ]),
    ).toEqual([
      ResumeSection.Personal,
      ResumeSection.Projects,
      ResumeSection.Education,
    ]);
  });
});
