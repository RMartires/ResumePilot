export const DEFAULT_AI_MODEL = "deepseek/deepseek-v4-flash";

/** Model slug from request override, OPENROUTER_DEFAULT_MODEL env, or default. */
export function resolveModelId(model?: string): string {
  const fromRequest = model?.trim();
  if (fromRequest) return fromRequest;

  const fromEnv = process.env.OPENROUTER_DEFAULT_MODEL?.trim();
  if (fromEnv) return fromEnv;

  return DEFAULT_AI_MODEL;
}
