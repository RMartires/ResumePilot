import { ContentHubGrid } from "@/components/marketing/ContentHubGrid";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { COMPARISONS, published } from "@/lib/seo/content";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMarketingMetadata({
  title: "Resume Tool Comparisons",
  description: "Compare resume builders, ATS checkers, and application tools across the features that matter to your workflow.",
  path: "/compare",
});
export default function CompareHubPage() {
  const items = published(COMPARISONS).map((item) => ({ title: item.title, description: item.description, path: item.canonical }));
  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Compare", path: "/compare" }]),
        itemListJsonLd("Resume tool comparisons", items.map((item) => ({ name: item.title, path: item.path, description: item.description }))),
      ]} />
      <MarketingPage eyebrow="Compare" title="Choose the right resume workflow" description="Clear feature comparisons to help you evaluate resume and job-search tools.">
        <ContentHubGrid items={items} />
      </MarketingPage>
    </>
  );
}
