import { describe, expect, it } from "vitest";
import { getResumeExample } from "./registry";
import { resolveInternalLink, resolveRelatedLinks } from "./internal-links";

describe("internal content links", () => {
  it("resolves links to published registry records", () => {
    const example = getResumeExample("software-engineer");
    expect(example).toBeDefined();
    const links = resolveRelatedLinks(example!);
    expect(links.every((link) => link.content?.status === "published")).toBe(true);
  });

  it("retains known static links without inventing content", () => {
    expect(resolveInternalLink({ title: "ATS checker", path: "/tools/ats-checker" }))
      .toEqual({ title: "ATS checker", path: "/tools/ats-checker", content: undefined });
  });
});
