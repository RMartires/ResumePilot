import Link from "next/link";
import { getSubscriptionStatusForUser } from "@/lib/billing/entitlements";
import { createClient } from "@/lib/supabase/server";

export async function BillingBanner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const status = await getSubscriptionStatusForUser(user.id);

  if (status.isPro) {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-emerald-950">ResumePilot Pro</p>
          <p className="text-xs text-emerald-800">
            {status.currentPeriodEnd
              ? `Renews ${new Date(status.currentPeriodEnd).toLocaleDateString()}`
              : "Active subscription"}
          </p>
        </div>
        <a
          href="/api/billing/portal"
          className="rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-900 transition hover:bg-emerald-100"
        >
          Manage billing
        </a>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-blue-950">Unlock unlimited AI</p>
        <p className="text-xs text-blue-800">
          Upgrade to Pro for AI chat, PDF import, and tailoring.
        </p>
      </div>
      <Link
        href="/pricing"
        className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
      >
        View plans
      </Link>
    </div>
  );
}
