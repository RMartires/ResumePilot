// import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(_request: NextRequest) {
  // Supabase auth bypassed for local template testing
  return NextResponse.next();
  // return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/resumes/:path*",
    "/login",
    "/signup",
  ],
};
