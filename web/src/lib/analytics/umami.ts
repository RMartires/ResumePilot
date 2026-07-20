export const UMAMI_WEBSITE_ID = "852ab99f-9cf8-4854-9646-c097c8e352b1";
export const UMAMI_SCRIPT_URL = "https://umami.blogcrafter.co/script.js";
export const UMAMI_RECORDER_URL = "https://umami.blogcrafter.co/recorder.js";
/** Skip localhost / preview noise in production analytics. */
export const UMAMI_DOMAINS = "resumepilot.xyz,www.resumepilot.xyz";

/** Umami Distinct ID max length. */
const DISTINCT_ID_MAX = 50;
const UMAMI_READY_MAX_ATTEMPTS = 40;
const UMAMI_READY_INTERVAL_MS = 250;

export const AnalyticsEvent = {
  CtaGetStarted: "cta_get_started",
  SignupStarted: "signup_started",
  SignupCompleted: "signup_completed",
  LoginStarted: "login_started",
  LoginCompleted: "login_completed",
  ResumeCreated: "resume_created",
  ResumeImported: "resume_imported",
  ResumeImportFailed: "resume_import_failed",
  TemplateSelected: "template_selected",
  EditorOpened: "editor_opened",
  AiChatSent: "ai_chat_sent",
  AiSuggestionApplied: "ai_suggestion_applied",
  ResumeSaved: "resume_saved",
  PdfExported: "pdf_exported",
  ResumeDuplicated: "resume_duplicated",
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

export type AnalyticsEventData = Record<
  string,
  string | number | boolean | undefined
>;

type UmamiClient = {
  track: (
    event: string | Record<string, unknown> | ((props: object) => object),
    data?: AnalyticsEventData,
  ) => void;
  identify: (id: string | AnalyticsEventData, data?: AnalyticsEventData) => void;
};

declare global {
  interface Window {
    umami?: UmamiClient;
  }
}

let currentUserEmail: string | undefined;

function getUmami(): UmamiClient | undefined {
  if (typeof window === "undefined") return undefined;
  return window.umami;
}

/** Run once Umami script has created window.umami (afterInteractive). */
function whenUmamiReady(run: (umami: UmamiClient) => void): void {
  if (typeof window === "undefined") return;

  const umami = getUmami();
  if (umami) {
    run(umami);
    return;
  }

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    const ready = getUmami();
    if (ready) {
      window.clearInterval(timer);
      run(ready);
      return;
    }
    if (attempts >= UMAMI_READY_MAX_ATTEMPTS) {
      window.clearInterval(timer);
    }
  }, UMAMI_READY_INTERVAL_MS);
}

function compactEventData(
  data?: AnalyticsEventData,
): Record<string, string | number | boolean> | undefined {
  if (!data) return undefined;
  const next: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    next[key] =
      typeof value === "string" ? value.slice(0, 500) : value;
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

/** Distinct ID for Sessions search — email when available (≤50 chars). */
export function toDistinctId(email: string): string {
  return email.trim().toLowerCase().slice(0, DISTINCT_ID_MAX);
}

/**
 * Identify the visitor by email so Sessions can be searched by email,
 * and attach email to later events for "most active user" breakdowns.
 */
export function identifyUser(input: {
  email: string;
  userId?: string;
}): void {
  const email = input.email.trim().toLowerCase();
  if (!email) return;

  currentUserEmail = email;

  const sessionData = compactEventData({
    email,
    ...(input.userId ? { user_id: input.userId } : {}),
  });
  const distinctId = toDistinctId(email);

  whenUmamiReady((umami) => {
    umami.identify(distinctId, sessionData);
  });
}

/** Fire a custom Umami event. Queues until the tracker script is ready. */
export function track(
  event: AnalyticsEventName | string,
  data?: AnalyticsEventData,
): void {
  const payload = compactEventData({
    ...(currentUserEmail ? { email: currentUserEmail } : {}),
    ...data,
  });

  whenUmamiReady((umami) => {
    if (payload) {
      umami.track(event, payload);
      return;
    }
    umami.track(event);
  });
}
