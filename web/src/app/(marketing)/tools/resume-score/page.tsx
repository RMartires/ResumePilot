import Link from "next/link";
import { AtsToolClient } from "@/components/marketing/AtsToolClient";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  webApplicationJsonLd,
} from "@/lib/seo/structured-data";

const title = "Free Resume Score Checker";
const description =
  "Get a free resume score in seconds. Check formatting, contact details, section structure, and optional job-description keyword match.";

export const metadata = createMarketingMetadata({
  title,
  description,
  path: "/tools/resume-score",
});

export default function ResumeScorePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Resume score", path: "/tools/resume-score" },
        ])}
      />
      <JsonLd
        data={webApplicationJsonLd({
          name: "ResumePilot Resume Score",
          description,
          path: "/tools/resume-score",
          featureList: [
            "Resume formatting score",
            "Contact detail checks",
            "Section structure checks",
            "Optional job-description keyword match",
          ],
        })}
      />
      <MarketingPage
        eyebrow="Free tool"
        title="Resume score"
        description="Upload your resume for an instant score based on ATS-friendly formatting. Add a job description to include keyword match — free, no sign-up."
      >
      <AtsToolClient mode="resume-score" />
      <div className="mt-12 max-w-3xl space-y-3 text-sm leading-7 text-zinc-400">
        <h2 className="text-xl font-semibold text-white">What a good resume score means</h2>
        <p>
          A high score means your resume has clear contact info, standard sections, and a
          length that parsers handle well. Pair it with our{" "}
          <Link href="/tools/ats-checker" className="text-blue-300 hover:text-blue-200">
            ATS resume checker
          </Link>{" "}
          when targeting a specific posting, then rebuild in an{" "}
          <Link href="/templates" className="text-blue-300 hover:text-blue-200">
            ATS template
          </Link>{" "}
          inside ResumePilot.
        </p>
      </div>
      </MarketingPage>
    </>
  );
}
