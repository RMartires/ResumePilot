import DodoPayments from "dodopayments";

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

export function getBillingReturnUrl(): string {
  return (
    process.env.DODO_PAYMENTS_RETURN_URL ??
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/checkout/success`
  );
}

export function isDodoConfigured(): boolean {
  return Boolean(process.env.DODO_PAYMENTS_API_KEY);
}
