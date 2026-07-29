import Link from "next/link";
import { redirect } from "next/navigation";
import { X } from "lucide-react";
import { ProPricingCard } from "@/components/billing/ProPricingCard";
import { getSubscriptionStatusForUser } from "@/lib/billing/entitlements";
import { createClient } from "@/lib/supabase/server";

export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const status = await getSubscriptionStatusForUser(user.id);
  if (status.isPro) {
    redirect("/dashboard/billing");
  }

  return (
    <div className="mx-auto max-w-lg p-6 sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Upgrade
          </p>
          <h1 className="mt-1 text-2xl font-bold">Choose your plan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Unlock unlimited AI, checks, and PDF exports.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Maybe later"
          title="Maybe later"
        >
          <X className="size-5" />
        </Link>
      </div>

      <ProPricingCard variant="dashboard" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Or review usage on{" "}
        <Link
          href="/dashboard/billing"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Usage & Billing
        </Link>
        .
      </p>
    </div>
  );
}
