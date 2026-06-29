/**
 * Stream only the `message` field from structured output into the UI chat stream.
 */
export async function streamStructuredMessageField(
  partialOutputStream: AsyncIterable<{ message?: unknown }>,
  writeTextDelta: (delta: string) => void,
  onTextStart: () => void,
  onTextEnd: () => void,
): Promise<string> {
  let lastMessage = "";
  let started = false;

  for await (const partial of partialOutputStream) {
    const nextMessage =
      typeof partial?.message === "string" ? partial.message : "";

    if (nextMessage.length === 0) continue;

    if (!started) {
      onTextStart();
      started = true;
    }

    if (nextMessage.length > lastMessage.length) {
      writeTextDelta(nextMessage.slice(lastMessage.length));
      lastMessage = nextMessage;
    }
  }

  if (started) {
    onTextEnd();
  }

  return lastMessage;
}
