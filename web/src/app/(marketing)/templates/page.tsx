import Link from "next/link";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { PublicTemplateCard } from "@/components/marketing/PublicTemplateCard";
import { SignInCta } from "@/components/marketing/SignInCta";
import { JsonLd } from "@/lib/seo/json-ld";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import { PUBLIC_TEMPLATES } from "@/lib/seo/public-templates";
import {
  breadcrumbJsonLd,
  itemListJsonLd,
} from "@/lib/seo/structured-data";

const title = "ATS Friendly Resume Templates (Free)";
const description =
  "Download-ready ATS friendly resume templates. Single-column, parse-safe layouts that work with Workday, Greenhouse, Lever, and Taleo.";

export const metadata = createMarketingMetadata({
  title,
  description,
  path: "/templates",
});

export default function TemplatesIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Resume templates", path: "/templates" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          "ATS friendly resume templates",
          PUBLIC_TEMPLATES.map((template) => ({
            name: template.name,
            path: `/templates/${template.slug}`,
            description: template.description,
          })),
        )}
      />
      <MarketingPage
        eyebrow="Templates"
        title="ATS friendly resume templates"
        description="Parser-safe layouts built for modern applicant tracking systems. Pick a template, tailor it in ResumePilot, and export PDF or Word."
      >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PUBLIC_TEMPLATES.map((template) => (
          <PublicTemplateCard key={template.slug} template={template} />
        ))}
      </div>

      <div className="mt-12 space-y-4 text-sm leading-7 text-zinc-400">
        <h2 className="text-xl font-semibold text-white">
          What makes a resume template ATS-friendly?
        </h2>
        <p>
          Applicant tracking systems read text, not design. The strongest ATS friendly
          resume templates use a single column, standard headings, and avoid tables,
          text boxes, and icons in the body. ResumePilot defaults to parse-safe formatting
          so you can focus on keywords and quantified bullets. For the layout, file type,
          and section-order rules behind those templates, see the{" "}
          <Link href="/guides/ats/ats-friendly-resume-format" className="text-blue-300 hover:text-blue-200">
            ATS-friendly resume format
          </Link>{" "}
          guide. For how to pull terms from one posting, see{" "}
          <Link href="/guides/ats/resume-keywords" className="text-blue-300 hover:text-blue-200">
            resume keywords
          </Link>
          .
        </p>
        <p>
          Prefer a free score before you apply? Try the{" "}
          <Link href="/tools/ats-checker" className="text-blue-300 hover:text-blue-200">
            ATS resume checker
          </Link>{" "}
          or{" "}
          <Link href="/tools/resume-score" className="text-blue-300 hover:text-blue-200">
            resume score
          </Link>{" "}
          tool.
        </p>
      </div>

      <div className="mt-12">
        <SignInCta
          title="Edit any template in the builder"
          description="Sign in free, apply a template, and tailor it to each job description."
          href="/login?redirect=%2Fdashboard%2Ftemplates"
        />
      </div>
      </MarketingPage>
    </>
  );
}
