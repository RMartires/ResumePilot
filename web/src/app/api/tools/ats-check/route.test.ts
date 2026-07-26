import { describe, expect, it } from "vitest";
import {
  MAX_JSON_BODY_BYTES,
  MAX_TEXT_CHARS,
  POST,
} from "./route";
import { MAX_PDF_BYTES } from "@/lib/pdf/validation";

const endpoint = "https://www.resumepilot.xyz/api/tools/ats-check";

async function errorMessage(response: Response) {
  return (await response.json()) as { error: string };
}

describe("POST /api/tools/ats-check", () => {
  it("accepts a bounded JSON request", async () => {
    const response = await POST(
      new Request(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          resumeText:
            "Jordan Lee jordan@example.com Experience Software Engineer Education Skills TypeScript",
          jdText: "TypeScript software engineer",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toHaveProperty("result.overallScore");
  });

  it("rejects text instead of silently truncating it", async () => {
    const response = await POST(
      new Request(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resumeText: "a".repeat(MAX_TEXT_CHARS + 1) }),
      }),
    );

    expect(response.status).toBe(413);
    await expect(errorMessage(response)).resolves.toEqual({
      error: "resumeText must be 80,000 characters or fewer.",
    });
  });

  it("rejects oversized bodies even without Content-Length", async () => {
    const response = await POST(
      new Request(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: " ".repeat(MAX_JSON_BODY_BYTES + 1),
      }),
    );

    expect(response.status).toBe(413);
    await expect(errorMessage(response)).resolves.toEqual({
      error: "Request body is too large.",
    });
  });

  it("rejects malformed, mistyped, and unsupported payloads", async () => {
    const malformed = await POST(
      new Request(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      }),
    );
    const mistyped = await POST(
      new Request(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resumeText: 42 }),
      }),
    );
    const unsupported = await POST(
      new Request(endpoint, {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: "resume",
      }),
    );

    expect(malformed.status).toBe(400);
    expect(mistyped.status).toBe(400);
    expect(unsupported.status).toBe(415);
  });

  it("enforces text limits for multipart submissions", async () => {
    const form = new FormData();
    form.set("resumeText", "a".repeat(MAX_TEXT_CHARS + 1));
    const response = await POST(
      new Request(endpoint, {
        method: "POST",
        body: form,
      }),
    );

    expect(response.status).toBe(413);
    await expect(errorMessage(response)).resolves.toEqual({
      error: "resumeText must be 80,000 characters or fewer.",
    });
  });

  it("rejects PDF uploads over 10 MB", async () => {
    const boundary = "ats-limit-test-boundary";
    const encoder = new TextEncoder();
    const prefix = encoder.encode(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="oversized.pdf"\r\nContent-Type: application/pdf\r\n\r\n`,
    );
    const file = new Uint8Array(MAX_PDF_BYTES + 1);
    file.set(encoder.encode("%PDF-"));
    const suffix = encoder.encode(`\r\n--${boundary}--\r\n`);
    const body = new Uint8Array(prefix.length + file.length + suffix.length);
    body.set(prefix);
    body.set(file, prefix.length);
    body.set(suffix, prefix.length + file.length);

    const response = await POST(
      new Request(endpoint, {
        method: "POST",
        headers: {
          "content-type": `multipart/form-data; boundary=${boundary}`,
        },
        body,
      }),
    );

    expect({
      status: response.status,
      ...(await errorMessage(response)),
    }).toEqual({
      status: 413,
      error: "PDF must be 10 MB or smaller.",
    });
  });
});

