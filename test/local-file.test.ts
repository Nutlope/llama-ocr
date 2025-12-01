import { describe, it, expect } from "vitest";
import { ocr } from "../src/index";

describe("Local file path", () => {
  it("should perform OCR on local file", async () => {
    const markdown = await ocr({
      filePath: "./test/assets/trader-joes-receipt.jpg",
      apiKey: process.env.TOGETHER_API_KEY,
    });
    expect(markdown).toBeTruthy();
    expect(typeof markdown).toBe("string");
  });
});
