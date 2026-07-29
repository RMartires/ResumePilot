export const FREE_TIER_LIMITS = {
  ai_chat: 10,
  ats_check: 3,
  resume_score: 3,
  pdf_download: 3,
} as const;

export type UsageEventType = keyof typeof FREE_TIER_LIMITS;

export const USAGE_EVENT_LABELS: Record<UsageEventType, string> = {
  ai_chat: "AI chat messages",
  ats_check: "ATS checks",
  resume_score: "resume score runs",
  pdf_download: "PDF downloads",
};
