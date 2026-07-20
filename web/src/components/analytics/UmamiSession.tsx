"use client";

import { useEffect } from "react";
import { AnalyticsEvent, identifyUser, track } from "@/lib/analytics/umami";

const NEW_USER_WINDOW_MS = 5 * 60 * 1000;

type UmamiSessionProps = {
  userId: string;
  email: string;
  createdAt?: string | null;
};

/**
 * Identifies the Umami session by email. Fires login/signup completion only
 * after a real OAuth return (`?umami_login=1` from /auth/callback).
 */
export function UmamiSession({ userId, email, createdAt }: UmamiSessionProps) {
  useEffect(() => {
    if (!email) return;

    identifyUser({ email, userId });

    const params = new URLSearchParams(window.location.search);
    if (params.get("umami_login") !== "1") return;

    track(AnalyticsEvent.LoginCompleted);

    if (createdAt) {
      const ageMs = Date.now() - new Date(createdAt).getTime();
      if (Number.isFinite(ageMs) && ageMs >= 0 && ageMs < NEW_USER_WINDOW_MS) {
        track(AnalyticsEvent.SignupCompleted);
      }
    }

    params.delete("umami_login");
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }, [userId, email, createdAt]);

  return null;
}
