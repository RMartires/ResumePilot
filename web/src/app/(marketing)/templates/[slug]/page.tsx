import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { PublicTemplatePreview } from "@/components/marketing/PublicTemplatePreview";
import { SignInCta } from "@/components/marketing/SignInCta";
import { JsonLd } from "@/lib/seo/json-ld";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import {
  getAllPublicTemplateSlugs,
  getPublicTemplate,
} from "@/lib/seo/public-templates";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPublicTemplateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getPublicTemplate(slug);
  if (!template) return {};

  return createMarketingMetadata({
    title: `${template.name} — ATS Friendly Resume Template`,
    description: template.description,
    path: `/templates/${slug}`,
  });
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const template = getPublicTemplate(slug);
  if (!template) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Resume templates", path: "/templates" },
          { name: template.name, path: `/templates/${slug}` },
        ])}
      />
      <MarketingPage
        eyebrow="ATS friendly resume template"
        title={template.name}
        description={template.description}
      >
      <div className="grid gap-10 lg:grid-cols-2">
        <PublicTemplatePreview template={template} />
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Why this template works</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {template.atsNotes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm leading-7 text-zinc-400">
            Use this layout as a starting point, then paste a job description in ResumePilot
            to close keyword gaps before you export. Browse all{" "}
            <Link href="/templates" className="text-blue-300 hover:text-blue-200">
              ATS friendly resume templates
            </Link>
            .
          </p>
          <SignInCta
            title={`Start with ${template.name}`}
            description="Create a free account to apply this template and export an ATS-safe PDF."
            href={`/login?redirect=${encodeURIComponent("/dashboard/templates")}`}
            label="Use this template"
            templateSlug={template.slug}
          />
        </div>
      </div>
      </MarketingPage>
    </>
  );
}
