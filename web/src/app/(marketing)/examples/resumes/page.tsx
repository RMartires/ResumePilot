import { ContentHubGrid } from "@/components/marketing/ContentHubGrid";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { published, RESUME_EXAMPLES } from "@/lib/seo/content";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMarketingMetadata({
  title: "Resume Examples by Role",
  description: "Browse role-specific resume examples with focused summaries, skills, and measurable accomplishment bullets.",
  path: "/examples/resumes",
});
export default function ResumeExamplesPage() {
  const items = published(RESUME_EXAMPLES).map((item) => ({ title: item.title, description: item.description, path: item.canonical }));
  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Resume examples", path: "/examples/resumes" }]),
        itemListJsonLd("Resume examples", items.map((item) => ({ name: item.title, path: item.path, description: item.description }))),
      ]} />
      <MarketingPage eyebrow="Resume examples" title="See what strong evidence looks like" description="Use these role examples for structure and inspiration, then replace every detail with your own verified experience.">
        <ContentHubGrid items={items} />
      </MarketingPage>
    </>
  );
}
