import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBreadcrumbs } from "@/components/marketing/ContentBreadcrumbs";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { RelatedLinks } from "@/components/marketing/RelatedLinks";
import { RoleResumeExamplePreview } from "@/components/marketing/RoleResumeExamplePreview";
import { SignInCta } from "@/components/marketing/SignInCta";
import { JsonLd } from "@/lib/seo/json-ld";
import { createContentMetadata, getResumeExample, published, RESUME_EXAMPLES } from "@/lib/seo/content";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return published(RESUME_EXAMPLES).map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getResumeExample((await params).slug);
  return item ? createContentMetadata(item) : {};
}
export default async function ResumeExamplePage({ params }: Props) {
  const item = getResumeExample((await params).slug);
  if (!item) notFound();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Resume examples", path: "/examples/resumes" }, { name: item.title, path: item.canonical }];
  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd(crumbs),
        itemListJsonLd(item.title, item.experience.map((job) => ({
          name: `${job.title} at ${job.company}`,
          path: item.canonical,
          description: job.bullets.join(" "),
        }))),
      ]} />
      <MarketingPage eyebrow="Resume example" title={item.title} description={item.description}>
        <ContentBreadcrumbs items={crumbs} />
        <div className="grid gap-10 lg:grid-cols-2">
          <RoleResumeExamplePreview example={item} />
          <div>
            <h2 className="text-2xl font-semibold">Why this example works</h2>
            <ul className="mt-4 space-y-3 text-zinc-300">{item.tips.map((tip) => <li key={tip}>• {tip}</li>)}</ul>
            <div className="mt-8"><SignInCta title="Build your own role-targeted resume" /></div>
          </div>
        </div>
        <div className="mt-12"><RelatedLinks links={item.relatedLinks} /></div>
      </MarketingPage>
    </>
  );
}
