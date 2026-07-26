import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticleLayout } from "@/components/marketing/GuideArticleLayout";
import { SignInCta } from "@/components/marketing/SignInCta";
import { JsonLd } from "@/lib/seo/json-ld";
import { createContentMetadata, getGuide, GUIDES, published } from "@/lib/seo/content";
import { articleJsonLd, breadcrumbJsonLd, faqPageJsonLd, howToJsonLd } from "@/lib/seo/structured-data";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return published(GUIDES).filter((guide) => guide.kind === "ats").map((guide) => ({ slug: guide.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  return guide?.kind === "ats" ? createContentMetadata(guide) : {};
}
export default async function AtsGuidePage({ params }: Props) {
  const guide = getGuide((await params).slug);
  if (!guide || guide.kind !== "ats") notFound();
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: "ATS guides", path: "/guides/ats" },
    { name: guide.title, path: guide.canonical },
  ];
  return (
    <>
      <JsonLd data={[
        articleJsonLd({ headline: guide.title, description: guide.description, path: guide.canonical, datePublished: guide.datePublished, dateModified: guide.dateModified }),
        breadcrumbJsonLd(breadcrumbs),
        ...(guide.steps ? [howToJsonLd({ name: guide.title, description: guide.description, path: guide.canonical, steps: guide.steps })] : []),
        ...(guide.faqs ? [faqPageJsonLd(guide.faqs)] : []),
      ]} />
      <GuideArticleLayout guide={guide} breadcrumbs={breadcrumbs}>
        <SignInCta title="Check your resume against the job" description="Find structure and relevance gaps before you apply." href="/tools/ats-checker" label="Check my resume" />
      </GuideArticleLayout>
    </>
  );
}
