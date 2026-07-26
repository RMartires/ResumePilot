import Link from "next/link";
import { AtsToolClient } from "@/components/marketing/AtsToolClient";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  webApplicationJsonLd,
} from "@/lib/seo/structured-data";

const title = "Free ATS Resume Checker";
const description =
  "Free ATS resume checker — upload a PDF or paste your resume, match keywords from a job description, and fix formatting issues before you apply.";

export const metadata = createMarketingMetadata({
  title,
  description,
  path: "/tools/ats-checker",
});

export default function AtsCheckerPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "ATS resume checker", path: "/tools/ats-checker" },
        ])}
      />
      <JsonLd
        data={webApplicationJsonLd({
          name: "ResumePilot ATS Resume Checker",
          description,
          path: "/tools/ats-checker",
          featureList: [
            "PDF text extraction",
            "Job-description keyword comparison",
            "Contact and section checks",
            "Heuristic ATS match score",
          ],
        })}
      />
      <MarketingPage
        eyebrow="Free tool"
        title="ATS resume checker"
        description="See how your resume stacks up against a job description. Instant heuristic match score, keyword gaps, and parse-safe formatting checks — no account required."
      >
      <AtsToolClient mode="ats-checker" />
      <div className="mt-12 max-w-3xl space-y-3 text-sm leading-7 text-zinc-400">
        <h2 className="text-xl font-semibold text-white">How this ATS checker works</h2>
        <p>
          We extract text from your PDF, scan for contact details and standard section
          headings, and compare keywords from the job posting. Scores are estimates — not a
          guarantee from any specific ATS vendor. For a full{" "}
          <Link href="/tools/resume-score" className="text-blue-300 hover:text-blue-200">
            resume score
          </Link>{" "}
          without a JD, or to browse{" "}
          <Link href="/templates" className="text-blue-300 hover:text-blue-200">
            ATS friendly resume templates
          </Link>
          , use the linked tools.
        </p>
      </div>
      </MarketingPage>
    </>
  );
}
