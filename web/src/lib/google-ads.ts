export const GOOGLE_ADS_ID = "AW-17738329494";
export const SIGNUP_CONVERSION_SEND_TO = `${GOOGLE_ADS_ID}/tx9eCOCm5MEbEJbbpYpC`;
const GOOGLE_ADS_SCRIPT_ID = "google-ads-script";

let googleAdsInitialized = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function initializeGoogleAds() {
  if (googleAdsInitialized || typeof window === "undefined") return;
  googleAdsInitialized = true;

  window.dataLayer ??= [];
  window.gtag ??= (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ADS_ID);

  if (!document.getElementById(GOOGLE_ADS_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GOOGLE_ADS_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    document.head.append(script);
  }
}

/** Fire only after the OAuth callback reliably classifies a new account. */
export function reportSignupConversion() {
  if (typeof window === "undefined") return;

  initializeGoogleAds();
  window.gtag?.("event", "conversion", {
    send_to: SIGNUP_CONVERSION_SEND_TO,
    value: 1.0,
    currency: "INR",
  });
}
