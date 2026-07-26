import Link from "next/link";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { SignInCta } from "@/components/marketing/SignInCta";
import { createMarketingMetadata } from "@/lib/seo/metadata";

export const metadata = createMarketingMetadata({
  title: "About ResumePilot — AI Resume Builder",
  description:
    "ResumePilot helps job seekers build ATS-friendly resumes with AI writing, keyword matching, templates, and application tracking — without juggling five tools.",
  path: "/about",
});

const principles = [
  {
    title: "ATS-first by default",
    body: "Templates and scoring prioritize what parsers and recruiters can actually read — single-column layouts, clear headings, and keyword fit against the job description.",
  },
  {
    title: "One workflow, not five tabs",
    body: "Write, tailor, score, export, and track applications in one place so you spend less time on formatting and more time on interviews.",
  },
  {
    title: "Useful before you sign up",
    body: "Public tools like the free ATS checker and resume score exist so you can judge fit before creating an account.",
  },
] as const;

export default function AboutPage() {
  return (
    <MarketingPage
      eyebrow="About"
      title="An AI resume builder built around how hiring actually works"
      description="ResumePilot is a web app for people who need a sharper resume this week — not another generic template pack. We focus on ATS readability, role-specific tailoring, and a clear path from draft to applied."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {principles.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-4 text-sm leading-7 text-zinc-400">
        <p>
          The product lives at{" "}
          <a
            href="https://www.resumepilot.xyz"
            className="text-blue-300 hover:text-blue-200"
          >
            resumepilot.xyz
          </a>
          . Sign in with Google to save resumes, export PDFs, and use the full
          editor. Explore{" "}
          <Link href="/features" className="text-blue-300 hover:text-blue-200">
            features
          </Link>
          ,{" "}
          <Link href="/templates" className="text-blue-300 hover:text-blue-200">
            templates
          </Link>
          , or our{" "}
          <Link href="/press" className="text-blue-300 hover:text-blue-200">
            press and product facts
          </Link>{" "}
          anytime.
        </p>
        <p>
          Questions about privacy or terms? See our{" "}
          <Link href="/privacy" className="text-blue-300 hover:text-blue-200">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-blue-300 hover:text-blue-200">
            Terms of Service
          </Link>
          .
        </p>
      </div>

      <div className="mt-12">
        <SignInCta />
      </div>
    </MarketingPage>
  );
}
