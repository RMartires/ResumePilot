import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AnalyticsEvent,
  identifyUser,
  trackPrivacySafe,
} from "./umami";
import { buildSeoFunnelPayload } from "./seo-funnel";

afterEach(() => {
  delete window.umami;
});

describe("buildSeoFunnelPayload", () => {
  it("keeps only allowlisted tool completion properties", () => {
    const payload = buildSeoFunnelPayload(
      AnalyticsEvent.SeoToolCompleted,
      {
        source_page: "/tools/ats-checker?email=private@example.com",
        tool: "ats-checker",
        email: "private@example.com",
        score: 92,
        filename: "resume.pdf",
      } as never,
    );

    expect(payload).toEqual({
      source_page: "/tools/ats-checker",
      tool: "ats-checker",
    });
  });

  it("rejects invalid controlled values", () => {
    const payload = buildSeoFunnelPayload(
      AnalyticsEvent.TemplateCtaClicked,
      {
        source_page: "https://example.com/templates/classic",
        template_slug: "Classic / private",
      },
    );

    expect(payload).toEqual({});
  });

  it("constructs the signup payload without identity fields", () => {
    expect(
      buildSeoFunnelPayload(AnalyticsEvent.SignupCompleted, {
        source_page: "/dashboard",
        auth_mode: "google",
      }),
    ).toEqual({
      source_page: "/dashboard",
      auth_mode: "google",
    });
  });
});

describe("trackPrivacySafe", () => {
  it("does not enrich a public event with the identified email", () => {
    const track = vi.fn();
    window.umami = { track, identify: vi.fn() };

    identifyUser({ email: "private@example.com", userId: "user-123" });
    trackPrivacySafe(AnalyticsEvent.MarketingCtaClicked, {
      source_page: "/pricing",
    });

    expect(track).toHaveBeenCalledWith(AnalyticsEvent.MarketingCtaClicked, {
      source_page: "/pricing",
    });
  });
});
