import { describe, expect, it } from "vitest";
import {
  parseSkillsString,
  serializeSkills,
  hasSkill,
  skillLabel,
} from "@/lib/skills";

describe("skills", () => {
  it("parseSkillsString handles flat list", () => {
    const entries = parseSkillsString("React, Python, Node.js");
    expect(entries).toHaveLength(3);
    expect(entries[0].name).toBe("React");
  });

  it("parseSkillsString handles grouped format", () => {
    const entries = parseSkillsString(
      "Languages: Java, Python | Tools: AWS",
    );
    expect(entries.length).toBeGreaterThanOrEqual(3);
  });

  it("serializeSkills round-trips flat skills", () => {
    const entries = parseSkillsString("React (2 yrs), Python");
    const serialized = serializeSkills(entries, false);
    expect(serialized).toContain("React (2 yrs)");
    expect(serialized).toContain("Python");
  });

  it("hasSkill is case insensitive", () => {
    const entries = parseSkillsString("React");
    expect(hasSkill(entries, "react")).toBe(true);
    expect(hasSkill(entries, "Vue")).toBe(false);
  });

  it("skillLabel formats years", () => {
    expect(skillLabel({ name: "Java", years: 2, category: "Languages" })).toBe(
      "Java (2 yrs)",
    );
    expect(skillLabel({ name: "Go", years: 1, category: "Languages" })).toBe(
      "Go (1 yr)",
    );
  });
});
