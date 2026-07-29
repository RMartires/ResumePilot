import { NextResponse } from "next/server";
import { getDodoClient, isDodoConfigured } from "@/lib/billing/dodo";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("dodo_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  const customerId = profile?.dodo_customer_id;
  if (!customerId) {
    return NextResponse.json(
      { error: "No billing account found. Subscribe to Pro first." },
      { status: 404 },
    );
  }

  if (!isDodoConfigured()) {
    return NextResponse.json(
      { error: "Billing is not configured." },
      { status: 503 },
    );
  }

  const client = getDodoClient();
  const session = await client.customers.customerPortal.create(customerId);
  return NextResponse.redirect(session.link);
}
