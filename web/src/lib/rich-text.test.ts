import { describe, expect, it } from "vitest";
import {
  bulletsToDoc,
  docToBullets,
  docToText,
  textToDoc,
} from "./rich-text";

describe("rich-text", () => {
  it("round-trips bullet lists", () => {
    const bullets = ["Built API", "Reduced latency 40%"];
    expect(docToBullets(bulletsToDoc(bullets))).toEqual(bullets);
  });

  it("returns empty bullet for blank input", () => {
    expect(docToBullets(bulletsToDoc([""]))).toEqual([""]);
  });

  it("round-trips plain text paragraphs", () => {
    const text = "Thesis on NLP\nDean's list";
    expect(docToText(textToDoc(text))).toBe(text);
  });
});
