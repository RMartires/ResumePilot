import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing/MarketingPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms that govern your use of ResumePilot, the AI resume builder and related free tools.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <MarketingPage
      eyebrow="Legal"
      title="Terms of Service"
      description="Last updated July 26, 2026. By using ResumePilot you agree to these terms."
    >
      <div className="prose prose-invert max-w-3xl space-y-6 text-sm leading-7 text-zinc-300">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">The service</h2>
          <p>
            ResumePilot provides AI-assisted resume building, templates, scoring tools, and
            related job-search features. Features may change over time. Free tools on the
            marketing site are provided as-is for evaluation and may have usage limits.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Your content</h2>
          <p>
            You retain ownership of the resume and job content you provide. You grant us a
            limited license to process that content to operate the product, including AI
            assistance you request. You are responsible for the accuracy of information you
            submit to employers.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Acceptable use</h2>
          <p>
            Do not misuse the service, attempt to bypass rate limits, reverse engineer the
            product, or use ResumePilot to create fraudulent credentials. AI suggestions are
            drafts — you must review and edit them before applying.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Disclaimer</h2>
          <p>
            ResumePilot does not guarantee interviews, job offers, or ATS outcomes. Scores
            and keyword matches are heuristic estimates and not a certification that any
            employer system will accept your resume.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a
              href="mailto:hello@resumepilot.xyz"
              className="text-blue-300 underline underline-offset-2"
            >
              hello@resumepilot.xyz
            </a>
            .
          </p>
        </section>
      </div>
    </MarketingPage>
  );
}
