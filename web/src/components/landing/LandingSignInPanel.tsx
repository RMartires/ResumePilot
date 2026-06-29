"use client";

import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { cn } from "@/lib/utils";

type LandingSignInPanelProps = {
  className?: string;
};

export function LandingSignInPanel({ className }: LandingSignInPanelProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="max-w-lg [&_button]:h-11 [&_button]:w-full [&_button]:rounded-full [&_button]:border-white/15 [&_button]:bg-white/5 [&_button]:text-white [&_button]:hover:bg-white/10">
        <GoogleSignInButton label="Continue with Google" />
      </div>

      <p className="text-xs text-zinc-400">
        By continuing, you agree to our{" "}
        <Link href="/privacy" className="text-emerald-300 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
