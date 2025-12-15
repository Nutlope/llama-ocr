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

  it("should perform OCR on base64 input", async () => {
    const fs = require("fs");
    const base64 = fs.readFileSync("./test/assets/trader-joes-receipt.jpg").toString("base64");
    const markdown = await ocr({
      filePath: base64,
      apiKey: process.env.TOGETHER_API_KEY,
    });
    expect(markdown).toBeTruthy();
    expect(typeof markdown).toBe("string");
  });
});
