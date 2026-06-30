import Link from "next/link";
import { ResumePilotMark } from "@/components/brand/ResumePilotLogo";

type LandingHeaderProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function LandingHeader({
  ctaHref = "#sign-in",
  ctaLabel = "Get started",
}: LandingHeaderProps) {
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
        {ctaHref.startsWith("#") ? (
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
