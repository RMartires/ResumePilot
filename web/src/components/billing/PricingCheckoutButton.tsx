"use client";

import { useState } from "react";
import type { BillingPlan } from "@/lib/billing/plans";

type PricingCheckoutButtonProps = {
  plan: BillingPlan;
  label: string;
  variant?: "primary" | "secondary";
};

export function PricingCheckoutButton({
  plan,
  label,
  variant = "primary",
}: PricingCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Could not start checkout");
      }

      window.location.href = data.checkoutUrl;
    } catch (checkoutError) {
      setLoading(false);
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Could not start checkout",
      );
    }
  };

  const className =
    variant === "primary"
      ? "w-full rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
      : "w-full rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white transition hover:border-blue-500/30 hover:bg-white/[0.06] disabled:opacity-60";

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={className}
      >
        {loading ? "Redirecting…" : label}
      </button>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
