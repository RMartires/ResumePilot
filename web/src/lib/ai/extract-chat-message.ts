function unescapeJsonString(value: string): string {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

/** Best-effort extraction while structured JSON is still streaming. */
export function extractPartialStructuredMessage(text: string): string | null {
  const match = text.match(/"message"\s*:\s*"((?:\\.|[^"\\])*)(?:"|$)/);
  if (!match?.[1]) return null;
  return unescapeJsonString(match[1]);
}

export function getAssistantChatText(rawText: string): string {
  const trimmed = rawText.trim();
  if (!trimmed) return "";

  const looksStructured =
    trimmed.startsWith("{") &&
    (trimmed.includes('"has_resume_changed"') ||
      trimmed.includes('"message"') ||
      trimmed.includes('"resume"'));

  if (!looksStructured) {
    return rawText;
  }

  try {
    const parsed = JSON.parse(trimmed) as { message?: unknown };
    if (typeof parsed.message === "string") {
      return parsed.message;
    }
  } catch {
    const partial = extractPartialStructuredMessage(trimmed);
    if (partial !== null) return partial;
  }

  return "";
}
