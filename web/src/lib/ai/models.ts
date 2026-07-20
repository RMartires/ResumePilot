export const DEFAULT_AI_MODEL = "google/gemini-2.5-flash";

/** Ultra-low-latency model for structured extraction (thinking off by default). */
export const DEFAULT_IMPORT_MODEL = "google/gemini-2.5-flash-lite";

/** Model slug from request override, OPENROUTER_DEFAULT_MODEL env, or default. */
export function resolveModelId(model?: string): string {
  const fromRequest = model?.trim();
  if (fromRequest) return fromRequest;

  const fromEnv = process.env.OPENROUTER_DEFAULT_MODEL?.trim();
  if (fromEnv) return fromEnv;

  return DEFAULT_AI_MODEL;
}

export function resolveImportModelId(): string {
  const fromEnv = process.env.OPENROUTER_IMPORT_MODEL?.trim();
  if (fromEnv) return fromEnv;
  return DEFAULT_IMPORT_MODEL;
}
