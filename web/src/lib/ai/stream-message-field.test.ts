import { describe, expect, it } from "vitest";
import { streamStructuredMessageField } from "@/lib/ai/stream-message-field";

describe("streamStructuredMessageField", () => {
  it("streams incremental message deltas", async () => {
    async function* partials() {
      yield { message: "Hel" };
      yield { message: "Hello" };
      yield { message: "Hello world" };
    }

    const deltas: string[] = [];
    let started = false;
    let ended = false;

    const result = await streamStructuredMessageField(
      partials(),
      (delta) => deltas.push(delta),
      () => {
        started = true;
      },
      () => {
        ended = true;
      },
    );

    expect(result).toBe("Hello world");
    expect(started).toBe(true);
    expect(ended).toBe(true);
    expect(deltas).toEqual(["Hel", "lo", " world"]);
  });
});
