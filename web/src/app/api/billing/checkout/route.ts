import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getBillingReturnUrl, getDodoClient, isDodoConfigured } from "@/lib/billing/dodo";
import { BILLING_PLANS, getProductIdForPlan, isBillingPlan } from "@/lib/billing/plans";
import { ensureProfile } from "@/lib/billing/entitlements";
import { REFERRAL_COOKIE_NAME } from "@/lib/referrals/constants";
import { normalizeReferralCode } from "@/lib/referrals/cookie";
import { SITE_URL } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";

const checkoutSchema = z.object({
  plan: z.enum(["monthly", "annual"]),
});

export async function POST(request: Request) {
  if (!isDodoConfigured()) {
    return NextResponse.json(
      { error: "Billing is not configured. Set DODO_PAYMENTS_API_KEY." },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const plan = parsed.data.plan;
  const productId = getProductIdForPlan(plan);
  if (!productId) {
    return NextResponse.json(
      {
        error: `Missing ${BILLING_PLANS[plan].envKey}. Create the product in Dodo and add its ID to env.`,
      },
      { status: 503 },
    );
  }

  const cookieStore = await cookies();
  const referralCode = normalizeReferralCode(
    cookieStore.get(REFERRAL_COOKIE_NAME)?.value ?? null,
  );

  await ensureProfile(user.id, user.email);

  const metadata: Record<string, string> = {
    supabase_user_id: user.id,
    plan,
  };
  if (referralCode) {
    metadata.referral_code = referralCode;
  }

  const client = getDodoClient();
  const session = await client.checkoutSessions.create({
    product_cart: [{ product_id: productId, quantity: 1 }],
    customer: {
      email: user.email,
      name:
        (typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : null) ??
        user.email.split("@")[0] ??
        "ResumePilot user",
    },
    return_url: getBillingReturnUrl(),
    cancel_url: `${SITE_URL}/dashboard/upgrade`,
    metadata,
    allowed_payment_method_types: [
      "upi_collect",
      "credit",
      "debit",
      "apple_pay",
      "google_pay",
    ],
  });

  if (!session.checkout_url) {
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    checkoutUrl: session.checkout_url,
    plan,
    productId,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const planParam = searchParams.get("plan");

  if (!planParam || !isBillingPlan(planParam)) {
    return NextResponse.json({ error: "Missing or invalid plan" }, { status: 400 });
  }

  return POST(
    new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planParam }),
    }),
  );
}
