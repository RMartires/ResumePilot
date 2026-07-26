import { ContentHubGrid } from "@/components/marketing/ContentHubGrid";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { GUIDES, published } from "@/lib/seo/content";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMarketingMetadata({
  title: "ATS Resume Guides",
  description: "Understand applicant tracking systems and build resumes with readable structure and relevant language.",
  path: "/guides/ats",
});

export default function AtsGuidesPage() {
  const guides = published(GUIDES).filter((guide) => guide.kind === "ats");
  const items = guides.map((guide) => ({ title: guide.title, description: guide.description, path: guide.canonical }));
  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: "ATS", path: "/guides/ats" }]),
        itemListJsonLd("ATS resume guides", items.map((item) => ({ name: item.title, path: item.path, description: item.description }))),
      ]} />
      <MarketingPage eyebrow="ATS guides" title="Make your resume easier to parse" description="Straightforward explanations of ATS structure, keywords, exports, and common myths.">
        <ContentHubGrid items={items} />
      </MarketingPage>
    </>
  );
}
