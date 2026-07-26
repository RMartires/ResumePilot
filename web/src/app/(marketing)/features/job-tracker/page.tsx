import { MarketingPage } from "@/components/marketing/MarketingPage";
import { SignInCta } from "@/components/marketing/SignInCta";
import { createMarketingMetadata } from "@/lib/seo/metadata";

export const metadata = createMarketingMetadata({
  title: "Job Application Tracker",
  description:
    "Track job applications in a kanban-style pipeline — from saved roles to interviews — with resume versions attached to each posting.",
  path: "/features/job-tracker",
});

export default function JobTrackerFeaturePage() {
  return (
    <MarketingPage
      eyebrow="Feature"
      title="Job application tracker"
      description="Stop losing tailored resumes in Downloads. Keep every posting, status, and resume version in one pipeline while you apply."
    >
      <div className="max-w-3xl space-y-6 text-sm leading-7 text-zinc-300">
        <p>
          A job application tracker should sit next to the resume you actually sent — not
          in a separate spreadsheet. ResumePilot’s tracker is designed as a kanban from
          saved roles through interviews, with the tailored resume attached to each card.
        </p>
        <ul className="space-y-2">
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Pipeline stages from wishlist to offer
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Attach the resume version used for that application
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            Built for high-volume searchers who tailor every JD
          </li>
        </ul>
        <p className="text-zinc-400">
          Tracking ships alongside the resume builder. Sign in free to organize your search
          in the same workspace you write and export from.
        </p>
      </div>
      <div className="mt-12">
        <SignInCta
          title="Organize your search in one place"
          description="Sign in to build resumes now and keep applications moving through one tracker."
        />
      </div>
    </MarketingPage>
  );
}
