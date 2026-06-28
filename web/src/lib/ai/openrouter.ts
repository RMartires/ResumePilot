import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { resolveModelId } from "@/lib/ai/models";

export function getOpenRouterProvider() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  return createOpenRouter({
    apiKey,
    headers: {
      "HTTP-Referer":
        process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_APP_NAME ?? "ResumeBuilder",
    },
  });
}

export function getChatModel(modelId?: string) {
  const openrouter = getOpenRouterProvider();
  return openrouter(resolveModelId(modelId));
}
