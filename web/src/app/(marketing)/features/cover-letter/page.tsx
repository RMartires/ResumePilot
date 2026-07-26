import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { SignInCta } from "@/components/marketing/SignInCta";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator",
  description:
    "Generate role-specific cover letters that stay in sync with your resume and the job description you’re applying to.",
  alternates: { canonical: "/features/cover-letter" },
};

export default function CoverLetterFeaturePage() {
  return (
    <MarketingPage
      eyebrow="Feature"
      title="AI cover letter generator"
      description="Draft cover letters that mirror the role, reuse proof from your resume, and avoid generic AI filler — then edit in your voice before you send."
    >
      <div className="max-w-3xl space-y-6 text-sm leading-7 text-zinc-300">
        <p>
          A strong cover letter generator should start from the same facts as your resume
          and the keywords in the posting. ResumePilot’s workflow is built around that
          pairing: tailor the resume first with our{" "}
          <Link href="/tools/ats-checker" className="text-blue-300 hover:text-blue-200">
            ATS resume checker
          </Link>
          , then produce a letter that reinforces the same story.
        </p>
        <ul className="space-y-2">
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Role-specific opening and closing, not a one-size template
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Pulls metrics and skills from the resume you’re already editing
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Designed to be edited — drafts you own, not copy-paste spam
          </li>
        </ul>
        <p className="text-zinc-400">
          Cover letter generation is rolling out in the product. Sign in to use the AI
          resume builder today; letter drafting lands in the same dashboard workflow.
        </p>
      </div>
      <div className="mt-12">
        <SignInCta
          title="Start with your resume, add the letter next"
          description="Create a free account to build an ATS-safe resume now — cover letters follow the same job you’re targeting."
        />
      </div>
    </MarketingPage>
  );
}
