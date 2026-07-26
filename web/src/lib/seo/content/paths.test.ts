import { describe, expect, it } from "vitest";
import {
  comparisonPath,
  getPublishedContentPaths,
  guidePath,
  objectivePath,
  resumeExamplePath,
  skillsPath,
} from "./paths";

describe("content paths", () => {
  it("builds canonical route families", () => {
    expect(guidePath("how-to-make-a-resume")).toBe("/guides/how-to-make-a-resume");
    expect(guidePath("how-to-beat-an-ats")).toBe("/guides/ats/how-to-beat-an-ats");
    expect(resumeExamplePath("software-engineer")).toBe("/examples/resumes/software-engineer");
    expect(objectivePath("software-engineer")).toBe("/examples/objectives/software-engineer");
    expect(skillsPath("software-engineer")).toBe("/skills/software-engineer");
    expect(comparisonPath("a-vs-b")).toBe("/compare/a-vs-b");
  });

  it("returns unique published sitemap paths including hubs", () => {
    const paths = getPublishedContentPaths();
    expect(paths).toContain("/guides");
    expect(paths).toContain("/compare/resumepilot-vs-jobscan");
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).not.toContain("/roles/software-engineer");
  });
});
