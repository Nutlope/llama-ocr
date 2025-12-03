import { describe, it, expect } from "vitest";
import { ocr } from "../src/index";

describe("PDF input", () => {
  it("should perform OCR on PDF", async () => {
    const markdown = await ocr({
      filePath: "https://bitcoin.org/bitcoin.pdf",
      apiKey: process.env.TOGETHER_API_KEY,
      maxPages: 2,
    });
    expect(markdown).toBeTruthy();
    expect(typeof markdown).toBe("string");
    expect(markdown).toContain("Bitcoin");
    expect(markdown).toContain("Satoshi Nakamoto");
    expect(markdown).toContain("peer-to-peer");
    expect(markdown).toContain("--- Page");
  });
});
