type ApiErrorPayload = {
  error?: string;
  code?: string;
  eventType?: string;
  used?: number;
  limit?: number;
  upgradeUrl?: string;
};

const USAGE_FRIENDLY: Record<string, string> = {
  ai_chat:
    "You've used all free AI chat messages for this month. Upgrade to Pro for unlimited chat.",
  ats_check:
    "You've used all free ATS checks for this month. Upgrade to Pro for unlimited checks.",
  resume_score:
    "You've used all free resume scores for this month. Upgrade to Pro for unlimited scoring.",
  pdf_download:
    "You've used all free PDF downloads for this month. Upgrade to Pro for unlimited exports.",
};

function parseApiErrorPayload(raw: string): ApiErrorPayload | null {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) {
    return null;
  }
  try {
    return JSON.parse(trimmed) as ApiErrorPayload;
  } catch {
    return null;
  }
}

/** Turn AI SDK / API error bodies into a short user-facing message. */
export function formatUserFacingApiError(raw: string | undefined | null): {
  message: string;
  upgradeUrl?: string;
  isUsageLimit: boolean;
} {
  if (!raw?.trim()) {
    return { message: "Something went wrong. Please try again.", isUsageLimit: false };
  }

  const payload = parseApiErrorPayload(raw);
  if (payload) {
    const isUsageLimit = payload.code === "USAGE_LIMIT_EXCEEDED";
    if (isUsageLimit) {
      const friendly =
        (payload.eventType && USAGE_FRIENDLY[payload.eventType]) ||
        payload.error ||
        "You've reached your free plan limit for this month.";
      return {
        message: friendly,
        upgradeUrl: payload.upgradeUrl ?? "/dashboard/upgrade",
        isUsageLimit: true,
      };
    }

    if (payload.error) {
      return {
        message: payload.error,
        upgradeUrl: payload.upgradeUrl,
        isUsageLimit: false,
      };
    }
  }

  if (raw.includes("USAGE_LIMIT_EXCEEDED") || /limit reached/i.test(raw)) {
    return {
      message:
        "You've reached your free plan limit for this month. Upgrade to Pro to continue.",
      upgradeUrl: "/dashboard/upgrade",
      isUsageLimit: true,
    };
  }

  return { message: raw, isUsageLimit: false };
}
