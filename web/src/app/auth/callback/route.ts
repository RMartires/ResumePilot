import { NextResponse } from "next/server";
import { isReliableNewSignup } from "@/lib/auth/signup-completion";
import { createClient } from "@/lib/supabase/server";

function redirectAfterLogin(
  origin: string,
  next: string,
  authResult: "signup" | "login",
) {
  const path = next.startsWith("/") ? next : "/dashboard";
  const url = new URL(path, origin);
  // Lets the client report completion once, only after code exchange succeeds.
  url.searchParams.set("auth_result", authResult);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const authResult = isReliableNewSignup({
        createdAt: data.user.created_at,
        lastSignInAt: data.user.last_sign_in_at,
      })
        ? "signup"
        : "login";
      return redirectAfterLogin(origin, next, authResult);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
