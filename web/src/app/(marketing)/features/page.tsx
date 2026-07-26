import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { SignInCta } from "@/components/marketing/SignInCta";

export const metadata: Metadata = {
  title: "Features — AI Resume Builder Toolkit",
  description:
    "Explore ResumePilot features: AI writing, ATS scoring, cover letters, LinkedIn import, job tracking, and ATS friendly templates.",
  alternates: { canonical: "/features" },
};

const featureLinks = [
  {
    href: "/tools/ats-checker",
    title: "ATS scoring & checker",
    description:
      "Free heuristic ATS resume checker with keyword gaps and formatting flags.",
  },
  {
    href: "/templates",
    title: "ATS friendly templates",
    description: "Parser-safe layouts for Workday, Greenhouse, Lever, and Taleo.",
  },
  {
    href: "/features/cover-letter",
    title: "Cover letter generator",
    description: "Role-specific cover letters synced with your resume and the JD.",
  },
  {
    href: "/features/job-tracker",
    title: "Job application tracker",
    description: "Kanban-style pipeline from saved roles to interviews.",
  },
  {
    href: "/features/linkedin-import",
    title: "LinkedIn resume builder",
    description: "Turn a LinkedIn profile into a structured, exportable resume.",
  },
  {
    href: "/tools/resume-score",
    title: "Resume score",
    description: "Instant free resume score based on ATS-friendly formatting.",
  },
] as const;

export default function FeaturesIndexPage() {
  return (
    <MarketingPage
      eyebrow="Product"
      title="Everything in one job search workflow"
      description="Build, tailor, score, and track applications without juggling five tools. Start free with Google sign-in."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureLinks.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-blue-500/30 hover:bg-white/[0.05]"
          >
            <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {feature.description}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-12">
        <SignInCta />
      </div>
    </MarketingPage>
  );
}
