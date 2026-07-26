import {
  AnalyticsEvent,
  trackPrivacySafe,
  type AnalyticsEventData,
} from "@/lib/analytics/umami";

export type SeoTool = "ats-checker" | "resume-score";
export type AuthMode = "google";

type SeoFunnelEventData = {
  [AnalyticsEvent.MarketingCtaClicked]: {
    source_page: string;
  };
  [AnalyticsEvent.SeoToolCompleted]: {
    source_page: string;
    tool: SeoTool;
  };
  [AnalyticsEvent.TemplateCtaClicked]: {
    source_page: string;
    template_slug: string;
  };
  [AnalyticsEvent.SignupStarted]: {
    source_page: string;
    auth_mode: AuthMode;
  };
  [AnalyticsEvent.SignupCompleted]: {
    source_page: string;
    auth_mode: AuthMode;
  };
};

export type SeoFunnelEventName = keyof SeoFunnelEventData;

const ALLOWED_PROPERTIES: Record<SeoFunnelEventName, readonly string[]> = {
  [AnalyticsEvent.MarketingCtaClicked]: ["source_page"],
  [AnalyticsEvent.SeoToolCompleted]: ["source_page", "tool"],
  [AnalyticsEvent.TemplateCtaClicked]: ["source_page", "template_slug"],
  [AnalyticsEvent.SignupStarted]: ["source_page", "auth_mode"],
  [AnalyticsEvent.SignupCompleted]: ["source_page", "auth_mode"],
};

function sanitizeValue(key: string, value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (key === "source_page") {
    const path = trimmed.split(/[?#]/, 1)[0];
    return path.startsWith("/") ? path.slice(0, 200) : undefined;
  }
  if (key === "tool") {
    return trimmed === "ats-checker" || trimmed === "resume-score"
      ? trimmed
      : undefined;
  }
  if (key === "auth_mode") {
    return trimmed === "google" ? trimmed : undefined;
  }
  if (key === "template_slug") {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)
      ? trimmed.slice(0, 100)
      : undefined;
  }
  return undefined;
}

/** Build an allowlisted, non-PII payload for public SEO funnel events. */
export function buildSeoFunnelPayload<E extends SeoFunnelEventName>(
  event: E,
  data: SeoFunnelEventData[E],
): AnalyticsEventData {
  const payload: AnalyticsEventData = {};
  for (const key of ALLOWED_PROPERTIES[event]) {
    const value = sanitizeValue(
      key,
      (data as Record<string, unknown>)[key],
    );
    if (value !== undefined) payload[key] = value;
  }
  return payload;
}

export function trackSeoFunnelEvent<E extends SeoFunnelEventName>(
  event: E,
  data: SeoFunnelEventData[E],
): void {
  trackPrivacySafe(event, buildSeoFunnelPayload(event, data));
}
