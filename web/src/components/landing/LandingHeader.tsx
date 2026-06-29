import Link from "next/link";

function LandingLogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="36" height="36" rx="10" fill="#059669" />
      <path
        d="M11 10.5C11 9.67 11.67 9 12.5 9H19.5L24 13.5V25.5C24 26.33 23.33 27 22.5 27H12.5C11.67 27 11 26.33 11 25.5V10.5Z"
        fill="white"
      />
      <path d="M19.5 9L24 13.5H20.5C19.95 13.5 19.5 13.05 19.5 12.5V9Z" fill="#D1FAE5" />
      <path
        d="M14 15.5H21"
        stroke="#059669"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 18.5H19.5"
        stroke="#059669"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path d="M23.5 20.5L28.5 17.5V23.5L23.5 20.5Z" fill="#047857" />
    </svg>
  );
}

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
          <LandingLogoMark />
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
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            {ctaLabel}
          </a>
        ) : (
          <Link
            href={ctaHref}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </header>
  );
}

export { LandingLogoMark };
