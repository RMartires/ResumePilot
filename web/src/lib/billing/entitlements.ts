import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type SubscriptionStatus = {
  isPro: boolean;
  planTier: "free" | "pro";
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

const PRO_STATUSES = new Set(["active", "on_hold"]);

function resolveIsPro(input: {
  planTier: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}): boolean {
  if (input.planTier === "pro") {
    if (input.currentPeriodEnd) {
      return new Date(input.currentPeriodEnd).getTime() > Date.now();
    }
    return true;
  }

  if (!input.status || !PRO_STATUSES.has(input.status)) {
    return false;
  }

  if (input.currentPeriodEnd) {
    return new Date(input.currentPeriodEnd).getTime() > Date.now();
  }

  return input.status === "active";
}

export async function getSubscriptionStatusForUser(
  userId: string,
): Promise<SubscriptionStatus> {
  const supabase = await createClient();

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("plan_tier").eq("id", userId).maybeSingle(),
    supabase
      .from("subscriptions")
      .select("status, current_period_end, cancel_at_period_end")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const planTier = profile?.plan_tier === "pro" ? "pro" : "free";
  const status = subscription?.status ?? null;
  const currentPeriodEnd = subscription?.current_period_end ?? null;
  const cancelAtPeriodEnd = subscription?.cancel_at_period_end ?? false;

  const isPro = resolveIsPro({
    planTier,
    status,
    currentPeriodEnd,
    cancelAtPeriodEnd,
  });

  return {
    isPro,
    planTier: isPro ? "pro" : "free",
    status,
    currentPeriodEnd,
    cancelAtPeriodEnd,
  };
}

/** Used by webhook handler with service role. */
export async function setUserPlanTier(
  userId: string,
  planTier: "free" | "pro",
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ plan_tier: planTier })
    .eq("id", userId);

  if (error) {
    throw new Error(`Failed to update plan tier: ${error.message}`);
  }
}

export async function ensureProfile(
  userId: string,
  email: string | null | undefined,
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("profiles").upsert(
    {
      id: userId,
      email: email ?? null,
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(`Failed to upsert profile: ${error.message}`);
  }
}
