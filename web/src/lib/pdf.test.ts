import { describe, expect, it } from "vitest";
import { pageContentHeightIn } from "./pdf";

describe("pageContentHeightIn", () => {
  it("returns printable height for letter page with 0.5in margins", () => {
    expect(pageContentHeightIn()).toBe(10);
  });
});
