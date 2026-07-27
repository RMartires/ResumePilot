"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BillingStatus = {
  isPro: boolean;
  planTier: "free" | "pro";
};

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 12;

    const poll = async () => {
      attempts += 1;
      try {
        const response = await fetch("/api/billing/status");
        if (!response.ok) {
          throw new Error("Could not verify subscription");
        }
        const data = (await response.json()) as BillingStatus;
        setStatus(data);
        if (data.isPro || attempts >= maxAttempts) {
          return;
        }
      } catch (pollError) {
        setError(
          pollError instanceof Error
            ? pollError.message
            : "Could not verify subscription",
        );
        return;
      }

      window.setTimeout(poll, 5000);
    };

    void poll();
  }, []);

  const isPro = status?.isPro;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#060810] px-6 py-16 text-white">
      <div className="max-w-lg rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {isPro ? "Welcome to Pro" : "Payment received"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {isPro
            ? "Your Pro features are active. Head back to the dashboard to use unlimited AI."
            : "We are confirming your subscription. This usually takes a minute. UPI renewals can take longer on later billing cycles."}
        </p>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Go to dashboard
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.05]"
          >
            Back to pricing
          </Link>
        </div>
      </div>
    </main>
  );
}
