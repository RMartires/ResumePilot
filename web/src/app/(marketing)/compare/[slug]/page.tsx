import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { ContentBreadcrumbs } from "@/components/marketing/ContentBreadcrumbs";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { RelatedLinks } from "@/components/marketing/RelatedLinks";
import { SignInCta } from "@/components/marketing/SignInCta";
import { JsonLd } from "@/lib/seo/json-ld";
import { COMPARISONS, createContentMetadata, getComparison, published } from "@/lib/seo/content";
import { articleJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo/structured-data";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return published(COMPARISONS).map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getComparison((await params).slug);
  return item ? createContentMetadata(item) : {};
}
export default async function ComparisonPage({ params }: Props) {
  const item = getComparison((await params).slug);
  if (!item) notFound();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Compare", path: "/compare" }, { name: item.title, path: item.canonical }];
  return (
    <>
      <JsonLd data={[
        articleJsonLd({ headline: item.title, description: item.description, path: item.canonical, datePublished: item.lastReviewed, dateModified: item.lastReviewed }),
        breadcrumbJsonLd(crumbs),
        faqPageJsonLd(item.faqs),
      ]} />
      <MarketingPage eyebrow="Comparison" title={item.title} description={item.description}>
        <ContentBreadcrumbs items={crumbs} />
        <ComparisonTable comparison={item} />
        <section className="mt-10 max-w-3xl"><h2 className="text-2xl font-semibold">The short verdict</h2><p className="mt-3 leading-8 text-zinc-300">{item.verdict}</p></section>
        <div className="mt-10 max-w-3xl space-y-8">
          {item.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold">{section.heading}</h2>
              <p className="mt-3 leading-8 text-zinc-300">{section.body}</p>
            </section>
          ))}
          <section>
            <h2 className="text-2xl font-semibold">ResumePilot limitations</h2>
            <ul className="mt-3 space-y-2 text-zinc-300">{item.limitations.map((limitation) => <li key={limitation}>• {limitation}</li>)}</ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
            <div className="mt-4 space-y-5">{item.faqs.map((faq) => <div key={faq.question}><h3 className="text-lg font-semibold">{faq.question}</h3><p className="mt-2 leading-7 text-zinc-300">{faq.answer}</p></div>)}</div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Official sources</h2>
            <p className="mt-2 text-sm text-zinc-400">Last reviewed: {item.lastReviewed}</p>
            <ul className="mt-3 space-y-2">{item.sources.map((source) => <li key={source.url}><a className="text-teal-300 underline underline-offset-4" href={source.url} rel="noreferrer" target="_blank">{source.title}</a></li>)}</ul>
          </section>
        </div>
        <div className="mt-10"><SignInCta title="Try ResumePilot with your own resume" /></div>
        <div className="mt-12"><RelatedLinks links={item.relatedLinks} /></div>
      </MarketingPage>
    </>
  );
}
