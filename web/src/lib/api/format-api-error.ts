type ApiErrorPayload = {
  error?: string;
};

function parseApiErrorPayload(raw: string): ApiErrorPayload | null {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) {
    return null;
  }
  try {
    return JSON.parse(trimmed) as ApiErrorPayload;
  } catch {
    return null;
  }
}

/** Turn AI SDK / API error bodies into a short user-facing message. */
export function formatUserFacingApiError(raw: string | undefined | null): string {
  if (!raw?.trim()) {
    return "Something went wrong. Please try again.";
  }

  const payload = parseApiErrorPayload(raw);
  if (payload?.error) {
    return payload.error;
  }

  return raw;
}
