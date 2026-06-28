import * as ai from "ai";
import { Client } from "langsmith";
import { wrapAISDK } from "langsmith/experimental/vercel";

export const langsmithClient = new Client();

export const { streamText, generateText, generateObject } = wrapAISDK(ai, {
  client: langsmithClient,
});

export function isLangSmithEnabled(): boolean {
  return (
    process.env.LANGSMITH_TRACING === "true" &&
    Boolean(process.env.LANGSMITH_API_KEY?.trim())
  );
}

export async function flushLangSmithTraces(): Promise<void> {
  if (!isLangSmithEnabled()) return;
  await langsmithClient.awaitPendingTraceBatches();
}
