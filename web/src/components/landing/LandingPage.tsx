import Link from "next/link";
import { WandSparkles } from "lucide-react";
import { UmamiScripts } from "@/components/analytics/UmamiScripts";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingSignInPanel } from "@/components/landing/LandingSignInPanel";
import {
  faqs,
  features,
  heroBullets,
  includedItems,
  stats,
  steps,
} from "@/components/landing/landing-data";
import { ProductDemo } from "@/components/landing/ProductDemo";

const signInPanelClassName = "max-w-lg";

export function LandingPage() {
  return (
    <>
    <div className="flex min-h-full flex-col bg-[#060810] text-white">
      <LandingHeader />

      <main>
        <section className="relative overflow-hidden px-6 pt-6 pb-12 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.25),_transparent_55%)]" />
          <div className="pointer-events-none absolute top-20 -right-24 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl" />

          <div className="relative mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                <WandSparkles className="h-3.5 w-3.5" aria-hidden />
                AI-powered resume builder
              </div>

              <h1 className="max-w-xl text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-6xl">
                Build resumes that{" "}
                <span className="bg-gradient-to-r from-blue-300 to-blue-200 bg-clip-text text-transparent">
                  get past ATS and get noticed
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300 sm:mt-5 sm:text-base sm:leading-7">
                ResumePilot analyzes, tailors, and improves your resume for every role —
                AI writing, ATS optimization, cover letters, and application tracking in one
                workflow.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-zinc-300 sm:mt-8">
                {heroBullets.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>

              <div id="sign-in" className="mt-8 scroll-mt-24 sm:mt-10">
                <LandingSignInPanel className={signInPanelClassName} />
              </div>
            </div>

            <div id="demo" className="mt-10 min-w-0 scroll-mt-24 sm:mt-12 lg:mt-14">
              <ProductDemo />
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.02] px-6 py-12">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-blue-300">Features</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need from first draft to offer
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Write smarter, match each job description, and stay organized through every
                application — without juggling multiple tools.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-blue-500/30 hover:bg-white/[0.05]"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-300">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-white/[0.02] px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-300">How it works</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                From blank page to tailored application in four steps
              </h2>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-white/10 bg-[#0a0e16] p-6"
                >
                  <span className="text-sm font-bold text-blue-400">{step.number}</span>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-medium text-blue-300">Everything included</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Your full job search toolkit
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Build, tailor, export, and track every application from one dashboard. No
                add-ons, no extra subscriptions, no tab switching.
              </p>
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-0">
              {includedItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-200"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-white/10 bg-white/[0.02] px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-white/10 bg-[#0a0e16] px-5 py-4"
                >
                  <summary className="cursor-pointer list-none font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {faq.question}
                      <span className="text-blue-400 transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-600/20 to-blue-700/10 px-6 py-12 text-center sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to land your next role?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-300">
              Join ResumePilot — AI writing, ATS scoring, job tailoring, and tracking in one
              place. No credit card required.
            </p>
            <LandingSignInPanel className={`mx-auto mt-8 ${signInPanelClassName}`} />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            ResumePilot — AI resume builder with ATS optimization. Sign in to get started.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
    <UmamiScripts />
    </>
  );
}
