import { NextResponse } from "next/server";
import { getUsageForUser } from "@/lib/billing/usage";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await getUsageForUser(user.id);
  return NextResponse.json(snapshot);
}
