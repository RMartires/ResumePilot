import { createAdminClient } from "@/lib/supabase/admin";
import { getSubscriptionStatusForUser } from "@/lib/billing/entitlements";
import {
  FREE_TIER_LIMITS,
  USAGE_EVENT_LABELS,
  type UsageEventType,
} from "@/lib/billing/limits";

const COUNTER_COLUMNS: Record<UsageEventType, string> = {
  ai_chat: "ai_chat_count",
  ats_check: "ats_check_count",
  resume_score: "resume_score_count",
  pdf_download: "pdf_download_count",
};

export type UsageSnapshot = Record<UsageEventType, { used: number; limit: number }>;

export function currentUsagePeriodMonth(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

export class UsageLimitError extends Error {
  readonly code = "USAGE_LIMIT_EXCEEDED" as const;
  readonly eventType: UsageEventType;
  readonly used: number;
  readonly limit: number;

  constructor(eventType: UsageEventType, used: number, limit: number) {
    super(
      `Free plan limit reached for ${USAGE_EVENT_LABELS[eventType]} (${used}/${limit} this month).`,
    );
    this.name = "UsageLimitError";
    this.eventType = eventType;
    this.used = used;
    this.limit = limit;
  }
}

async function readUsageCounts(
  userId: string,
  periodMonth: string,
): Promise<UsageSnapshot> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("usage_counters")
    .select(
      "ai_chat_count, ats_check_count, resume_score_count, pdf_download_count",
    )
    .eq("user_id", userId)
    .eq("period_month", periodMonth)
    .maybeSingle();

  const used = {
    ai_chat: data?.ai_chat_count ?? 0,
    ats_check: data?.ats_check_count ?? 0,
    resume_score: data?.resume_score_count ?? 0,
    pdf_download: data?.pdf_download_count ?? 0,
  };

  return {
    ai_chat: { used: used.ai_chat, limit: FREE_TIER_LIMITS.ai_chat },
    ats_check: { used: used.ats_check, limit: FREE_TIER_LIMITS.ats_check },
    resume_score: {
      used: used.resume_score,
      limit: FREE_TIER_LIMITS.resume_score,
    },
    pdf_download: {
      used: used.pdf_download,
      limit: FREE_TIER_LIMITS.pdf_download,
    },
  };
}

export async function getUsageForUser(userId: string): Promise<{
  isPro: boolean;
  periodMonth: string;
  usage: UsageSnapshot;
}> {
  const [{ isPro }, usage] = await Promise.all([
    getSubscriptionStatusForUser(userId),
    readUsageCounts(userId, currentUsagePeriodMonth()),
  ]);

  return {
    isPro,
    periodMonth: currentUsagePeriodMonth(),
    usage,
  };
}

export async function assertUsageAvailable(
  userId: string,
  eventType: UsageEventType,
): Promise<void> {
  const { isPro } = await getSubscriptionStatusForUser(userId);
  if (isPro) {
    return;
  }

  const periodMonth = currentUsagePeriodMonth();
  const usage = await readUsageCounts(userId, periodMonth);
  const { used, limit } = usage[eventType];

  if (used >= limit) {
    throw new UsageLimitError(eventType, used, limit);
  }
}

export async function recordUsage(
  userId: string,
  eventType: UsageEventType,
): Promise<void> {
  const { isPro } = await getSubscriptionStatusForUser(userId);
  if (isPro) {
    return;
  }

  const periodMonth = currentUsagePeriodMonth();
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("usage_counters")
    .select(
      "ai_chat_count, ats_check_count, resume_score_count, pdf_download_count",
    )
    .eq("user_id", userId)
    .eq("period_month", periodMonth)
    .maybeSingle();

  const counts = {
    ai_chat_count: existing?.ai_chat_count ?? 0,
    ats_check_count: existing?.ats_check_count ?? 0,
    resume_score_count: existing?.resume_score_count ?? 0,
    pdf_download_count: existing?.pdf_download_count ?? 0,
  };

  const column = COUNTER_COLUMNS[eventType] as keyof typeof counts;
  counts[column] += 1;

  const { error } = await admin.from("usage_counters").upsert(
    {
      user_id: userId,
      period_month: periodMonth,
      ...counts,
    },
    { onConflict: "user_id,period_month" },
  );

  if (error) {
    throw new Error(`Failed to record usage: ${error.message}`);
  }
}

export function usageLimitResponse(error: UsageLimitError) {
  return {
    error: error.message,
    code: error.code,
    eventType: error.eventType,
    used: error.used,
    limit: error.limit,
    upgradeUrl: "/pricing",
  };
}
