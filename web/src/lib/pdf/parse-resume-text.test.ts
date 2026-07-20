import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import { extractText, getDocumentProxy } from "unpdf";
import { parseResumeFromText } from "@/lib/pdf/parse-resume-text";

describe("parseResumeFromText", () => {
  it("parses hayden-smith style text confidently", () => {
    const text = `HAYDEN SMITH 214 Mitre Avenue, Park Hill, 3045 · 04501 123 456 · haydensmith@email.com PROFESSIONAL SUMMARY I am reliable hard working Year 11 student seeking casual or part-time customer service work in a sports retail environment. Having played soccer for nine years and a keen all-round sports enthusiast, I am looking to contribute knowledge and proven communications skills. SKILLS Customer service, Numeracy skills, Communication skills, Teamwork, Organisation skills, Problem solving EXPERIENCE Customer service (volunteer) December 2016 - March 2017 Park Hill Soccer Club Canteen - Served customers. - Handled cash including operating of cash register. Newspaper deliverer June 2016 - February 2017 Argo Newsagency - Delivered weekend newspapers to houses. EDUCATION Park Hill Secondary College Year 11 Current Park Hill Secondary College Year 11. Subjects include: Maths, English, Business Management, VET studies in Sport and Recreation.`;

    const result = parseResumeFromText(text);
    expect(result.confident).toBe(true);
    expect(result.resume.header.name.toLowerCase()).toContain("hayden");
    expect(result.resume.header.email).toBe("haydensmith@email.com");
    expect(result.resume.summary.toLowerCase()).toContain("year 11");
    expect(result.resume.skills.toLowerCase()).toContain("customer service");
    expect(result.resume.experience.length).toBeGreaterThanOrEqual(1);
    expect(result.resume.education.school.toLowerCase()).toContain("park hill");
  });

  it("parses the real hayden PDF when available", async () => {
    const path = "/Users/apple/Downloads/hayden-smith (2).pdf";
    let buf: Buffer;
    try {
      buf = readFileSync(path);
    } catch {
      return;
    }
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text } = await extractText(pdf, { mergePages: true });
    const raw = Array.isArray(text) ? text.join("\n") : text;
    const result = parseResumeFromText(raw);
    expect(result.confident).toBe(true);
    expect(result.resume.header.email).toBe("haydensmith@email.com");
  });
});
