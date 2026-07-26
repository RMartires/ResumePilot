export const GOOGLE_ADS_ID = "AW-17738329494";
export const SIGNUP_CONVERSION_SEND_TO = `${GOOGLE_ADS_ID}/tx9eCOCm5MEbEJbbpYpC`;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire only after the OAuth callback reliably classifies a new account. */
export function reportSignupConversion() {
  if (typeof window === "undefined") return;

  window.dataLayer ??= [];
  window.gtag ??= (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  window.gtag("event", "conversion", {
    send_to: SIGNUP_CONVERSION_SEND_TO,
    value: 1.0,
    currency: "INR",
  });
}
