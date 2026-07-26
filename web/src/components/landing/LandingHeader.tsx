"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { ResumePilotMark } from "@/components/brand/ResumePilotLogo";
import { startGoogleSignIn } from "@/components/auth/GoogleSignInButton";

type LandingHeaderProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

const navGroups = [
  {
    label: "Product",
    links: [{ href: "/features", label: "Features" }],
  },
  {
    label: "Tools",
    links: [
      { href: "/tools/ats-checker", label: "ATS Checker" },
      { href: "/tools/resume-score", label: "Resume Score" },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/templates", label: "Templates" },
      { href: "/guides", label: "Guides" },
      { href: "/examples/resumes", label: "Examples" },
    ],
  },
] as const;

export function LandingHeader({
  ctaHref,
  ctaLabel = "Get started",
}: LandingHeaderProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const resolvedHref = ctaHref ?? (pathname === "/" ? "#sign-in" : "/#sign-in");
  const startsOAuth = resolvedHref === "#sign-in";

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (!openDropdown) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openDropdown]);

  const handleGetStarted = async () => {
    setLoading(true);
    const { error } = await startGoogleSignIn("/dashboard", "cta");
    if (error) {
      setLoading(false);
    }
  };

  const ctaClassName =
    "shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60";

  const cta = startsOAuth ? (
    <button
      type="button"
      disabled={loading}
      onClick={handleGetStarted}
      className={ctaClassName}
    >
      {loading ? "Redirecting…" : ctaLabel}
    </button>
  ) : resolvedHref.startsWith("#") ? (
    <a href={resolvedHref} className={ctaClassName}>
      {ctaLabel}
    </a>
  ) : (
    <Link href={resolvedHref} className={ctaClassName}>
      {ctaLabel}
    </Link>
  );

  return (
    <header ref={headerRef} className="relative z-20 border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <ResumePilotMark className="h-9 w-9" />
          <span className="text-lg font-semibold tracking-tight">ResumePilot</span>
        </Link>

        <nav
          className="hidden items-center gap-2 text-sm text-zinc-300 lg:flex"
          aria-label="Primary navigation"
        >
          {navGroups.map((group) => {
            const isOpen = openDropdown === group.label;
            return (
              <div key={group.label} className="relative">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`nav-${group.label.toLowerCase()}`}
                  onClick={() =>
                    setOpenDropdown(isOpen ? null : group.label)
                  }
                  className="flex items-center gap-1 rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white"
                >
                  {group.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {isOpen ? (
                  <div
                    id={`nav-${group.label.toLowerCase()}`}
                    className="absolute top-full left-1/2 mt-2 w-48 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0b0e17] p-2"
                  >
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block rounded-lg px-3 py-2.5 transition hover:bg-white/5 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">{cta}</div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/5 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="marketing-mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="marketing-mobile-nav"
          className="border-t border-white/10 px-6 py-4 lg:hidden"
        >
          <nav
            className="grid gap-5 text-sm text-zinc-300 sm:grid-cols-3"
            aria-label="Mobile navigation"
          >
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                  {group.label}
                </p>
                <div className="mt-1 flex flex-col">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-2 py-2 transition hover:bg-white/5 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="mt-4 sm:hidden">{cta}</div>
        </div>
      ) : null}
    </header>
  );
}
