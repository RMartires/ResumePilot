import { describe, expect, it } from "vitest";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  howToJsonLd,
  itemListJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  webPageJsonLd,
} from "./structured-data";

describe("structured data builders", () => {
  it("describes the organization and a page about it without invented claims", () => {
    expect(organizationJsonLd()).toMatchObject({
      "@type": "Organization",
      name: "ResumePilot",
      url: "https://www.resumepilot.xyz",
    });
    expect(
      webPageJsonLd({
        name: "ResumePilot Press",
        description: "Factual product information for media.",
        path: "/press",
      }),
    ).toMatchObject({
      "@type": "WebPage",
      url: "https://www.resumepilot.xyz/press",
      about: {
        "@type": "Organization",
        name: "ResumePilot",
      },
    });
  });

  it("builds absolute, ordered breadcrumbs", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Templates", path: "/templates" },
    ]);

    expect(data.itemListElement).toEqual([
      expect.objectContaining({
        position: 1,
        item: "https://www.resumepilot.xyz",
      }),
      expect.objectContaining({
        position: 2,
        item: "https://www.resumepilot.xyz/templates",
      }),
    ]);
  });

  it("reports item-list size and unique URLs", () => {
    const data = itemListJsonLd("Templates", [
      { name: "Classic", path: "/templates/classic" },
      { name: "Compact", path: "/templates/compact" },
    ]);

    expect(data.numberOfItems).toBe(2);
    expect(new Set(data.itemListElement.map((item) => item.url)).size).toBe(2);
  });

  it("describes a free web tool and visible features", () => {
    const data = webApplicationJsonLd({
      name: "Resume Score",
      description: "Checks resume structure.",
      path: "/tools/resume-score",
      featureList: ["Section checks", "Formatting score"],
    });

    expect(data).toMatchObject({
      "@type": "WebApplication",
      url: "https://www.resumepilot.xyz/tools/resume-score",
      featureList: ["Section checks", "Formatting score"],
      offers: { price: "0", priceCurrency: "USD" },
    });
  });

  it("preserves visible how-to step order", () => {
    const data = howToJsonLd({
      name: "Check a resume",
      description: "Upload and review.",
      path: "/tools/ats-checker",
      steps: [
        { name: "Upload", text: "Upload a PDF." },
        { name: "Review", text: "Review the score." },
      ],
    });

    expect(data.step.map((step) => step.position)).toEqual([1, 2]);
  });

  it("builds article and page-specific FAQ data", () => {
    const article = articleJsonLd({
      headline: "How to write a resume",
      description: "A practical guide.",
      path: "/guides/how-to-make-a-resume",
      datePublished: "2026-07-26",
    });
    const faq = faqPageJsonLd([
      { question: "Is this page specific?", answer: "Yes, only visible questions are included here." },
    ]);
    expect(article).toMatchObject({
      "@type": "Article",
      url: "https://www.resumepilot.xyz/guides/how-to-make-a-resume",
    });
    expect(faq.mainEntity).toHaveLength(1);
    expect(faq.mainEntity[0].name).toBe("Is this page specific?");
  });
});
