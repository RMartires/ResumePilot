const MAX_CALLBACK_AGE_MS = 2 * 60 * 1000;
const MAX_FIRST_SIGN_IN_DELTA_MS = 5 * 1000;

type SignupCompletionInput = {
  createdAt?: string | null;
  lastSignInAt?: string | null;
  now?: number;
};

/**
 * Conservatively identifies a newly created OAuth account.
 * Both Supabase timestamps must be recent and nearly identical; ambiguous
 * successful authentications are treated as logins, not signup conversions.
 */
export function isReliableNewSignup({
  createdAt,
  lastSignInAt,
  now = Date.now(),
}: SignupCompletionInput): boolean {
  if (!createdAt || !lastSignInAt) return false;

  const createdMs = Date.parse(createdAt);
  const lastSignInMs = Date.parse(lastSignInAt);
  if (!Number.isFinite(createdMs) || !Number.isFinite(lastSignInMs)) {
    return false;
  }

  const callbackAgeMs = now - createdMs;
  const firstSignInDeltaMs = Math.abs(lastSignInMs - createdMs);

  return (
    callbackAgeMs >= 0 &&
    callbackAgeMs <= MAX_CALLBACK_AGE_MS &&
    firstSignInDeltaMs <= MAX_FIRST_SIGN_IN_DELTA_MS
  );
}
