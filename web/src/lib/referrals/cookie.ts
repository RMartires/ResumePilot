import { NextResponse, type NextRequest } from "next/server";
import {
  REFERRAL_COOKIE_MAX_AGE_SECONDS,
  REFERRAL_COOKIE_NAME,
  REFERRAL_QUERY_PARAM,
} from "@/lib/referrals/constants";

const REFERRAL_CODE_PATTERN = /^[a-zA-Z0-9_-]{2,40}$/;

export function normalizeReferralCode(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!REFERRAL_CODE_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed.toLowerCase();
}

export function applyReferralCookie(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  const referralCode = normalizeReferralCode(
    request.nextUrl.searchParams.get(REFERRAL_QUERY_PARAM),
  );

  if (!referralCode) {
    return response;
  }

  response.cookies.set(REFERRAL_COOKIE_NAME, referralCode, {
    maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}

export function readReferralCookie(request: NextRequest): string | null {
  return normalizeReferralCode(
    request.cookies.get(REFERRAL_COOKIE_NAME)?.value ?? null,
  );
}
