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
    expect(resume.activeSections.length).toBeGreaterThan(0);
  });

  it("normalizeResume handles sample data", () => {
    const resume = normalizeResume(sampleResume);
    expect(resume.header.name).toBe("Rohit Martires");
    expect(resume.experience.length).toBeGreaterThan(0);
    expect(resume.education.school).toContain("Don Bosco");
  });

  it("normalizeResume accepts education as an array", () => {
    const resume = normalizeResume({
      header: { name: "Alex", email: "a@b.com", links: "https://github.com/a" },
      skills: ["TypeScript", "Node.js"],
      education: [
        { school: "MIT", degree: "BS", year: "2018" },
        { school: "Stanford", degree: "MS", year: "2020" },
      ],
    });
    expect(resume.header.links).toEqual(["https://github.com/a"]);
    expect(resume.skills).toContain("TypeScript");
    expect(resume.education.school).toBe("MIT");
    expect(resume.education.secondary).toHaveLength(1);
    expect(resume.education.secondary[0].school).toBe("Stanford");
  });

  it("normalizeResume unwraps nested resume and stringified JSON", () => {
    const nested = normalizeResume({
      resume: { header: { name: "Nested", email: "n@e.com", phone: "1" } },
    });
    expect(nested.header.name).toBe("Nested");
    expect(nested.header.email).toBe("n@e.com");

    const asString = normalizeResume(
      JSON.stringify({ header: { name: "Stringified", location: "Goa" } }),
    );
    expect(asString.header.name).toBe("Stringified");
    expect(asString.header.location).toBe("Goa");
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
