import { describe, expect, it } from "vitest";
import { extractText, getDocumentProxy } from "unpdf";
import sampleResume from "@/data/sample-resume.json";
import { normalizeResume } from "@/lib/resume";
import { DEFAULT_TEMPLATES } from "@/lib/templates";
import { renderResumePdf } from "@/lib/pdf/render-resume-pdf";
import type { Resume } from "@/lib/validations/resume";
import { templateConfigSchema } from "@/lib/validations/resume";

async function pdfText(buffer: Buffer): Promise<string> {
  const proxy = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(proxy, { mergePages: true });
  return String(text).replace(/\s+/g, " ").trim();
}

async function pdfPageCount(buffer: Buffer): Promise<number> {
  const proxy = await getDocumentProxy(new Uint8Array(buffer));
  return proxy.numPages;
}

function templateFor(slug: "classic" | "compact" | "modern") {
  return templateConfigSchema.parse(
    DEFAULT_TEMPLATES.find((template) => template.slug === slug)!.config,
  );
}

function longResume(base: Resume): Resume {
  const fillerBullets = Array.from({ length: 40 }, (_, index) =>
    `Delivered measurable backend impact across distributed systems initiative ${index + 1}, improving reliability, latency, and developer productivity.`,
  );

  return normalizeResume({
    ...base,
    summary: `${base.summary} ${fillerBullets.slice(0, 4).join(" ")}`,
    experience: base.experience.map((job) => ({
      ...job,
      bullets: [...job.bullets, ...fillerBullets],
    })),
  });
}

describe("renderResumePdf", () => {
  const resume = normalizeResume(sampleResume);

  describe("classic template", () => {
    const classic = templateFor("classic");

    it("renders serif-style uppercase headings", async () => {
      const content = await pdfText(await renderResumePdf(resume, classic));

      expect(content.toUpperCase()).toContain("ROHIT MARTIRES");
      expect(content.toUpperCase()).toContain("PROFESSIONAL SUMMARY");
      expect(content.toUpperCase()).toContain("EXPERIENCE");
      expect(content.toUpperCase()).toContain("EDUCATION");
    });

    it("keeps experience in title, dates, company, bullets order", async () => {
      const content = await pdfText(await renderResumePdf(resume, classic));
      const titleIndex = content.indexOf("Senior Software Engineer (Backend / AI Systems)");
      const datesIndex = content.indexOf("Dec 2023 - Present");
      const companyIndex = content.indexOf("Primathon");
      const bulletIndex = content.indexOf(
        "Architected and authored system design for Snowplow-based event ingestion pipelines",
      );

      expect(titleIndex).toBeGreaterThan(-1);
      expect(datesIndex).toBeGreaterThan(titleIndex);
      expect(companyIndex).toBeGreaterThan(datesIndex);
      expect(bulletIndex).toBeGreaterThan(companyIndex);
    });

    it("renders education with school before degree", async () => {
      const content = await pdfText(await renderResumePdf(resume, classic));
      const schoolIndex = content.indexOf("Don Bosco College of Engineering");
      const degreeIndex = content.indexOf("BE/B.Tech/BS - Computer Engineering");
      const yearIndex = content.indexOf("2020");

      expect(schoolIndex).toBeGreaterThan(-1);
      expect(degreeIndex).toBeGreaterThan(schoolIndex);
      expect(yearIndex).toBeGreaterThan(schoolIndex);
    });
  });

  describe("compact template", () => {
    const compact = templateFor("compact");

    it("renders sentence-case headings", async () => {
      const content = await pdfText(await renderResumePdf(resume, compact));

      expect(content).toContain("Experience");
      expect(content).toContain("Professional Summary");
      expect(content).not.toMatch(/\bEXPERIENCE\b/);
      expect(content).not.toMatch(/\bPROFESSIONAL SUMMARY\b/);
    });

    it("keeps experience in title, dates, company, bullets order", async () => {
      const content = await pdfText(await renderResumePdf(resume, compact));
      const titleIndex = content.indexOf("Senior Software Engineer (Backend / AI Systems)");
      const datesIndex = content.indexOf("Dec 2023 - Present");
      const companyIndex = content.indexOf("Primathon");
      const bulletIndex = content.indexOf("Led a team of 3 developers");

      expect(titleIndex).toBeGreaterThan(-1);
      expect(datesIndex).toBeGreaterThan(titleIndex);
      expect(companyIndex).toBeGreaterThan(datesIndex);
      expect(bulletIndex).toBeGreaterThan(companyIndex);
    });

    it("wraps long experience titles while keeping dates on the header row", async () => {
      const longTitleResume = normalizeResume({
        ...resume,
        experience: [
          {
            title:
              "Senior Software Engineer (Backend / AI Systems / Platform Infrastructure)",
            company: "Primathon",
            dates: "Dec 2023 - Present",
            location: "",
            startDate: "",
            endDate: "",
            current: true,
            bullets: [
              "Built GenAI-powered ad creative generation APIs with model routing support.",
            ],
          },
        ],
      });

      const content = await pdfText(
        await renderResumePdf(longTitleResume, compact),
      );

      expect(content).toContain("Dec 2023 - Present");
      expect(content).toContain("Primathon");
      expect(content).toContain("Built GenAI-powered ad creative generation APIs");
    });
  });

  describe("modern template", () => {
    const modern = templateFor("modern");

    it("renders sidebar and main-column content", async () => {
      const content = await pdfText(await renderResumePdf(resume, modern));

      expect(content).toContain("Don Bosco College of Engineering");
      expect(content).toContain("Backend: Node.js");
      expect(content).toContain("Experience");
      expect(content).toContain("Senior Software Engineer (Backend / AI Systems) at Primathon");
      expect(content).toContain("Hindsight");
    });

    it("keeps multi-page main content readable", async () => {
      const pdf = await renderResumePdf(longResume(resume), modern);

      expect(await pdfPageCount(pdf)).toBeGreaterThan(1);

      const content = await pdfText(pdf);
      expect(content).toContain("Senior Software Engineer (Backend / AI Systems) at Primathon");
      expect(content).toContain("distributed systems initiative 40");
      expect(content).toContain("Don Bosco College of Engineering");
    });
  });

  it("returns a valid PDF for every default template", async () => {
    for (const template of DEFAULT_TEMPLATES) {
      const config = templateConfigSchema.parse(template.config);
      const pdf = await renderResumePdf(resume, config);

      expect(pdf.subarray(0, 5).toString("utf8")).toBe("%PDF-");
      expect(await pdfText(pdf)).toContain("Primathon");
    }
  });
});
