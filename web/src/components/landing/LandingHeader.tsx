"use client";

import Link from "next/link";
import { useState } from "react";
import { ResumePilotMark } from "@/components/brand/ResumePilotLogo";
import { startGoogleSignIn } from "@/components/auth/GoogleSignInButton";

type LandingHeaderProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function LandingHeader({
  ctaHref = "#sign-in",
  ctaLabel = "Get started",
}: LandingHeaderProps) {
  const [loading, setLoading] = useState(false);
  const startsOAuth = ctaHref === "#sign-in";

  const handleGetStarted = async () => {
    setLoading(true);
    const { error } = await startGoogleSignIn();
    if (error) {
      setLoading(false);
    }
  };

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <ResumePilotMark className="h-9 w-9" />
          <span className="text-lg font-semibold tracking-tight">ResumePilot</span>
        </Link>
        <a
          href="#demo"
          className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:text-white sm:inline-flex"
        >
          See how it works
        </a>
        {startsOAuth ? (
          <button
            type="button"
            disabled={loading}
            onClick={handleGetStarted}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Redirecting…" : ctaLabel}
          </button>
        ) : ctaHref.startsWith("#") ? (
          <a
            href={ctaHref}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            {ctaLabel}
          </a>
        ) : (
          <Link
            href={ctaHref}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </header>
  );
}
