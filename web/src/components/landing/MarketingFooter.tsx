import Link from "next/link";

const footerLinks = [
  { href: "/templates", label: "Templates" },
  { href: "/guides", label: "Guides" },
  { href: "/examples/resumes", label: "Examples" },
  { href: "/tools/ats-checker", label: "ATS Checker" },
  { href: "/tools/resume-score", label: "Resume Score" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/press", label: "Press" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
] as const;

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          ResumePilot — AI resume builder with ATS optimization. Sign in to get
          started.
        </p>
        <div className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
