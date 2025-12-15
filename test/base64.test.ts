import { describe, it, expect } from "vitest";
import { ocr } from "../src/index";
import { base64ImageLandscape } from "./assets/base64ImageLandscape";

describe("Base64 filePath input", () => {
  it("should perform OCR on base64 data URL", async () => {
    const markdown = await ocr({
      filePath: base64ImageLandscape.trim(),
      apiKey: process.env.TOGETHER_API_KEY,
    });
    expect(markdown).toBeTruthy();
    expect(typeof markdown).toBe("string");
  });
});
