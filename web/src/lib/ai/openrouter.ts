import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { resolveImportModelId, resolveModelId } from "@/lib/ai/models";

type OpenRouterMessage = {
  role?: string;
  content?: unknown;
};

/**
 * Alibaba/Qwen reject assistant messages with `content: null` during tool
 * loops. OpenRouter's provider sends null per OpenAI spec; coerce to "".
 * @see https://github.com/pydantic/pydantic-ai/issues/5287
 */
function createStrictProviderFetch(baseFetch: typeof fetch = fetch): typeof fetch {
  return async (input, init) => {
    if (init?.body && typeof init.body === "string") {
      try {
        const parsed = JSON.parse(init.body) as { messages?: OpenRouterMessage[] };
        if (Array.isArray(parsed.messages)) {
          parsed.messages = parsed.messages.map((message) => {
            if (
              message.role === "assistant" &&
              (message.content === null || message.content === undefined)
            ) {
              return { ...message, content: "" };
            }
            return message;
          });

          init = { ...init, body: JSON.stringify(parsed) };
        }
      } catch {
        // Non-JSON bodies pass through unchanged.
      }
    }

    return baseFetch(input, init);
  };
}

export function getOpenRouterProvider() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  return createOpenRouter({
    apiKey,
    fetch: createStrictProviderFetch(),
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

export function getImportModel() {
  const openrouter = getOpenRouterProvider();
  return openrouter(resolveImportModelId());
}
