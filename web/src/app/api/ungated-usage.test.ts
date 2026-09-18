import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = path.join(process.cwd(), "src");

function routeSource(relativePath: string) {
  return readFileSync(path.join(srcRoot, relativePath), "utf8");
}

const paywallMarkers = [
  "assertUsageAvailable",
  "recordUsage",
  "UsageLimitError",
  "usageLimitResponse",
  "upgradeUrl",
  "/dashboard/upgrade",
  "USAGE_LIMIT_EXCEEDED",
];

describe("ungated product usage", () => {
  it.each([
    "app/api/resumes/[id]/chat/route.ts",
    "app/api/resumes/[id]/export/route.ts",
    "app/api/tools/ats-check/route.ts",
  ])("%s has no usage paywall", (relativePath) => {
    const source = routeSource(relativePath);
    expect(source).not.toContain("status: 402");
    for (const marker of paywallMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
