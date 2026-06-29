"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function LoginForm() {
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError("Sign-in failed. Please try again.");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col bg-[#060a09] text-white">
      <LandingHeader ctaHref="/" ctaLabel="Back to home" />

      <div className="relative flex flex-1 items-center justify-center px-6 py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.2),_transparent_55%)]" />

        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0a100e]/90 p-8 shadow-2xl shadow-emerald-950/30">
          <div className="text-center">
            <p className="text-sm font-medium text-emerald-300">Welcome back</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">Sign in to ResumePilot</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Continue with Google to access your resumes, AI assistant, and templates.
            </p>
          </div>

          <div className="mt-8 [&_button]:h-11 [&_button]:rounded-full [&_button]:border-white/15 [&_button]:bg-white/5 [&_button]:text-white [&_button]:hover:bg-white/10">
            <GoogleSignInButton redirectTo={redirect} />
          </div>

          {error ? <p className="mt-4 text-center text-sm text-red-400">{error}</p> : null}

          <p className="mt-6 text-center text-xs text-zinc-500">
            Don&apos;t have access yet?{" "}
            <Link href="/" className="text-emerald-300 underline underline-offset-2">
              View the landing page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
