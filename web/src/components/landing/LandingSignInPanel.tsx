"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { cn } from "@/lib/utils";

type LandingSignInPanelProps = {
  className?: string;
  children?: ReactNode;
};

export function LandingSignInPanel({ className, children }: LandingSignInPanelProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="max-w-lg [&_button]:h-11 [&_button]:w-full [&_button]:rounded-full [&_button]:border-white/15 [&_button]:bg-white/5 [&_button]:text-white [&_button]:hover:bg-white/10">
        <GoogleSignInButton label="Continue with Google" intent="signup" />
      </div>

      {children}

      <p className="text-xs text-zinc-400">
        By continuing, you agree to our{" "}
        <Link href="/privacy" className="text-blue-300 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
