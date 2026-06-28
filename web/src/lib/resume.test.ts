import { describe, expect, it } from "vitest";
import {
  emptyResume,
  normalizeResume,
  resumeToJson,
  resumeToMarkdown,
} from "@/lib/resume";
import sampleResume from "@/data/sample-resume.json";

describe("resume", () => {
  it("emptyResume returns valid structure", () => {
    const resume = emptyResume();
    expect(resume.header.name).toBe("");
    expect(resume.experience).toHaveLength(1);
    expect(resume.projects).toHaveLength(1);
  });

  it("normalizeResume handles sample data", () => {
    const resume = normalizeResume(sampleResume);
    expect(resume.header.name).toBe("Rohit Martires");
    expect(resume.experience.length).toBeGreaterThan(0);
    expect(resume.education.school).toContain("Don Bosco");
  });

  it("resumeToJson strips empty bullets and links", () => {
    const resume = emptyResume();
    resume.experience[0].bullets = ["", "Built API"];
    resume.header.links = ["", "https://linkedin.com/in/test"];
    const json = resumeToJson(resume);
    expect(json.experience[0].bullets).toEqual(["Built API"]);
    expect(json.header.links).toEqual(["https://linkedin.com/in/test"]);
  });

  it("resumeToMarkdown includes sections", () => {
    const resume = normalizeResume(sampleResume);
    const md = resumeToMarkdown(resume);
    expect(md).toContain("[header]");
    expect(md).toContain("[experience]");
    expect(md).toContain("Rohit Martires");
  });
});
