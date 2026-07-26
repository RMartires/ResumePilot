import Link from "next/link";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import {
  organizationJsonLd,
  webPageJsonLd,
} from "@/lib/seo/structured-data";

const title = "ResumePilot Press and Product Facts";
const description =
  "Factual ResumePilot boilerplate, product details, brand guidance, and contact information for media and directory editors.";

export const metadata = createMarketingMetadata({
  title,
  description,
  path: "/press",
});

const productFacts = [
  "ResumePilot is a web-based resume builder focused on ATS-readable resumes and job-specific tailoring.",
  "The product combines resume editing, AI-assisted writing, PDF export, match scoring, cover-letter support, and application tracking.",
  "Public tools include an ATS resume checker and a standalone resume score; both can be tried without creating an account.",
  "ResumePilot publishes resume templates, resume examples, role-specific skills pages, and practical resume and ATS guides.",
] as const;

const resources = [
  {
    href: "/tools/ats-checker",
    title: "ATS resume checker",
    description: "Upload a PDF or paste text to review parseability and job-description keyword fit.",
  },
  {
    href: "/tools/resume-score",
    title: "Resume score",
    description: "Review resume structure and common ATS-readability signals without a job description.",
  },
  {
    href: "/templates",
    title: "Resume templates",
    description: "Browse public previews of ResumePilot's ATS-oriented resume layouts.",
  },
  {
    href: "/guides",
    title: "Resume and ATS guides",
    description: "Read practical guidance on resume writing, tailoring, exports, and ATS concepts.",
  },
] as const;

export default function PressPage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), webPageJsonLd({ name: title, description, path: "/press" })]} />
      <MarketingPage
        eyebrow="Press"
        title="ResumePilot facts and media resources"
        description="A factual reference for journalists, reviewers, career educators, and directory editors. Please verify time-sensitive product details against the linked product pages before publication."
      >
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">Boilerplate</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              ResumePilot is a web-based AI resume builder that helps job seekers write,
              tailor, score, export, and organize resumes in one workflow. It emphasizes
              ATS-readable layouts, job-description keyword matching, and practical guidance.
              ResumePilot also provides public resume tools, templates, examples, and guides
              that people can explore before signing in.
            </p>
          </section>

          <aside className="rounded-2xl border border-blue-400/20 bg-blue-500/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">Media contact</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              ResumePilot does not publish a separate media-relations address. Send factual
              questions and correction requests through the product&apos;s published general
              contact:{" "}
              <a
                href="mailto:hello@resumepilot.xyz"
                className="text-blue-300 underline underline-offset-4 hover:text-blue-200"
              >
                hello@resumepilot.xyz
              </a>
              .
            </p>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Product facts</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {productFacts.map((fact) => (
              <li
                key={fact}
                className="rounded-2xl border border-white/10 bg-[#0a0e16] p-5 text-sm leading-6 text-zinc-300"
              >
                {fact}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            ResumePilot does not claim that its scores predict interviews or guarantee
            acceptance by any specific applicant tracking system.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Product resources</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {resources.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-blue-400/30 hover:bg-blue-500/5"
              >
                <h3 className="font-semibold text-white group-hover:text-blue-200">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {resource.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 max-w-3xl space-y-4 text-sm leading-7 text-zinc-300">
          <h2 className="text-2xl font-semibold text-white">Brand usage</h2>
          <p>
            Write the product name as <strong className="font-semibold text-white">ResumePilot</strong>,
            with a capital R and P and no space. Refer to the company or product as
            ResumePilot on first mention.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-zinc-400">
            <li>Do not alter, redraw, crop, or recolor the ResumePilot mark.</li>
            <li>
              Do not use the name or mark in a way that implies endorsement, partnership,
              certification, or sponsorship.
            </li>
            <li>
              Do not add customer counts, launch dates, funding, awards, or performance
              claims unless ResumePilot has confirmed them in writing.
            </li>
            <li>
              Request current approved artwork through the published contact above; this
              page does not provide a downloadable press-logo pack.
            </li>
          </ul>
          <p>
            For more context, read{" "}
            <Link href="/about" className="text-blue-300 hover:text-blue-200">
              About ResumePilot
            </Link>{" "}
            and review the current{" "}
            <Link href="/features" className="text-blue-300 hover:text-blue-200">
              feature overview
            </Link>
            .
          </p>
        </section>
      </MarketingPage>
    </>
  );
}
