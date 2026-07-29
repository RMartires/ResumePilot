import DodoPayments from "dodopayments";
import { SITE_URL } from "@/lib/seo/site";

let client: DodoPayments | null = null;

export function getDodoClient(): DodoPayments {
  if (client) {
    return client;
  }

  const bearerToken = process.env.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) {
    throw new Error("DODO_PAYMENTS_API_KEY is not configured");
  }

  const environment =
    process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
      ? "live_mode"
      : "test_mode";

  client = new DodoPayments({ bearerToken, environment });
  return client;
}

/** Public app origin used for checkout return/cancel URLs. */
export function getBillingAppOrigin(): string {
  if (process.env.DODO_PAYMENTS_RETURN_URL) {
    try {
      return new URL(process.env.DODO_PAYMENTS_RETURN_URL).origin;
    } catch {
      // fall through
    }
  }

  // Live checkouts must never redirect to localhost if started from local .env.
  if (process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode") {
    return SITE_URL.replace(/\/$/, "");
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

export function getBillingReturnUrl(): string {
  if (process.env.DODO_PAYMENTS_RETURN_URL) {
    return process.env.DODO_PAYMENTS_RETURN_URL;
  }
  return `${getBillingAppOrigin()}/checkout/success`;
}

export function isDodoConfigured(): boolean {
  return Boolean(process.env.DODO_PAYMENTS_API_KEY);
}
