"use client";

import { useEffect } from "react";
import { AnalyticsEvent, identifyUser, track } from "@/lib/analytics/umami";
import { trackSeoFunnelEvent } from "@/lib/analytics/seo-funnel";
import { reportSignupConversion } from "@/lib/google-ads";

type UmamiSessionProps = {
  userId: string;
  email: string;
};

/**
 * Identifies the Umami session by email. Completion events only fire after a
 * successful OAuth code exchange classified by the server callback.
 */
export function UmamiSession({ userId, email }: UmamiSessionProps) {
  useEffect(() => {
    if (!email) return;

    identifyUser({ email, userId });

    const params = new URLSearchParams(window.location.search);
    const authResult = params.get("auth_result");
    if (authResult !== "signup" && authResult !== "login") return;

    if (authResult === "signup") {
      trackSeoFunnelEvent(AnalyticsEvent.SignupCompleted, {
        source_page: window.location.pathname,
        auth_mode: "google",
      });
      reportSignupConversion();
    } else {
      track(AnalyticsEvent.LoginCompleted, { auth_mode: "google" });
    }

    params.delete("auth_result");
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }, [userId, email]);

  return null;
}
