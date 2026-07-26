"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ResumePilotMark } from "@/components/brand/ResumePilotLogo";
import { startGoogleSignIn } from "@/components/auth/GoogleSignInButton";

type LandingHeaderProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

const navLinks = [
  { href: "/templates", label: "Templates" },
  { href: "/tools/ats-checker", label: "ATS Checker" },
  { href: "/features", label: "Features" },
] as const;

export function LandingHeader({
  ctaHref,
  ctaLabel = "Get started",
}: LandingHeaderProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const resolvedHref = ctaHref ?? (pathname === "/" ? "#sign-in" : "/#sign-in");
  const startsOAuth = resolvedHref === "#sign-in";

  const handleGetStarted = async () => {
    setLoading(true);
    const { error } = await startGoogleSignIn("/dashboard", "cta");
    if (error) {
      setLoading(false);
    }
  };

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <ResumePilotMark className="h-9 w-9" />
          <span className="text-lg font-semibold tracking-tight">ResumePilot</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {startsOAuth ? (
          <button
            type="button"
            disabled={loading}
            onClick={handleGetStarted}
            className="shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Redirecting…" : ctaLabel}
          </button>
        ) : resolvedHref.startsWith("#") ? (
          <a
            href={resolvedHref}
            className="shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            {ctaLabel}
          </a>
        ) : (
          <Link
            href={resolvedHref}
            className="shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </header>
  );
}
