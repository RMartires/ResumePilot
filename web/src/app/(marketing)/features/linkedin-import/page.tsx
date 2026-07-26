import Link from "next/link";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { SignInCta } from "@/components/marketing/SignInCta";
import { createMarketingMetadata } from "@/lib/seo/metadata";

export const metadata = createMarketingMetadata({
  title: "LinkedIn Resume Builder — Import Your Profile",
  description:
    "Turn your LinkedIn profile into a structured ATS-friendly resume. Import once, tailor per role, export PDF or Word.",
  path: "/features/linkedin-import",
});

export default function LinkedInImportFeaturePage() {
  return (
    <MarketingPage
      eyebrow="Feature"
      title="LinkedIn resume builder"
      description="Pull your experience into a clean resume structure, then tailor it for each job — without rebuilding from a blank page."
    >
      <div className="max-w-3xl space-y-6 text-sm leading-7 text-zinc-300">
        <p>
          LinkedIn is a great source of career history, but it’s not an ATS-safe resume.
          ResumePilot helps you import that profile into structured sections, apply an{" "}
          <Link href="/templates" className="text-blue-300 hover:text-blue-200">
            ATS friendly template
          </Link>
          , and export formats employers actually parse.
        </p>
        <ul className="space-y-2">
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Structured sections: experience, education, skills, summary
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Edit once, reuse across applications
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Pair with the{" "}
            <Link href="/tools/ats-checker" className="text-blue-300 hover:text-blue-200">
              ATS checker
            </Link>{" "}
            before you hit submit
          </li>
        </ul>
        <p className="text-zinc-400">
          You can also upload a PDF today and let ResumePilot parse it into the builder.
          LinkedIn import continues to deepen inside the authenticated product.
        </p>
      </div>
      <div className="mt-12">
        <SignInCta
          title="Import and tailor in minutes"
          description="Sign in free to upload a PDF or start from LinkedIn-ready structure in the builder."
        />
      </div>
    </MarketingPage>
  );
}
