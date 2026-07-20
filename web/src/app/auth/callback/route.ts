import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function redirectAfterLogin(origin: string, next: string) {
  const path = next.startsWith("/") ? next : "/dashboard";
  const url = new URL(path, origin);
  // Lets the client fire login_completed once after a real OAuth return.
  url.searchParams.set("umami_login", "1");
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirectAfterLogin(origin, next);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
