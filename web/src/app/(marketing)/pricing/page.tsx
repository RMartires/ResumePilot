import Link from "next/link";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { SignInCta } from "@/components/marketing/SignInCta";
import { createMarketingMetadata } from "@/lib/seo/metadata";

export const metadata = createMarketingMetadata({
  title: "Pricing — Free AI Resume Builder",
  description:
    "ResumePilot is free to start: AI resume builder, ATS-friendly templates, free ATS checker, and job tracking. Sign in with Google — no credit card required.",
  path: "/pricing",
});

const plans = [
  {
    name: "Free",
    price: "$0",
    blurb: "Everything you need to ship a stronger resume this week.",
    highlights: [
      "AI resume builder with Google sign-in",
      "ATS-friendly templates and PDF export",
      "Free public ATS checker & resume score tools",
      "Job application tracker",
      "LinkedIn import (rolling out)",
    ],
    cta: { href: "/#sign-in", label: "Start free" },
    featured: true,
  },
  {
    name: "Pro",
    price: "Coming soon",
    blurb: "More AI runs, advanced scoring, and team workflows — waitlist first.",
    highlights: [
      "Higher AI rewrite limits",
      "Deeper ATS / JD match scoring",
      "Cover letter generator (product)",
      "Priority support",
    ],
    cta: { href: "/#sign-in", label: "Join with free plan" },
    featured: false,
  },
] as const;

export default function PricingPage() {
  return (
    <MarketingPage
      eyebrow="Pricing"
      title="Free AI resume builder — start without a credit card"
      description="Build ATS-friendly resumes, check keyword fit, and track applications. The free plan is the full product for individuals today."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={
              plan.featured
                ? "rounded-2xl border border-blue-500/40 bg-gradient-to-b from-blue-600/20 to-blue-700/5 p-6 sm:p-8"
                : "rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
            }
          >
            <p className="text-sm font-medium text-blue-300">{plan.name}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {plan.price}
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{plan.blurb}</p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-300">
              {plan.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.cta.href}
              className="mt-8 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              {plan.cta.label}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm leading-6 text-zinc-500">
        Prefer to try before you sign up? Use the{" "}
        <Link
          href="/tools/ats-checker"
          className="text-blue-300 hover:text-blue-200"
        >
          free ATS resume checker
        </Link>{" "}
        or browse{" "}
        <Link href="/templates" className="text-blue-300 hover:text-blue-200">
          ATS-friendly templates
        </Link>
        .
      </p>

      <div className="mt-12">
        <SignInCta title="Create your free ResumePilot account" />
      </div>
    </MarketingPage>
  );
}
