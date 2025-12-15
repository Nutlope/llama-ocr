import { describe, it, expect } from "vitest";
import { ocr } from "../src/index";
import { DEFAULT_MODEL, FREE_MODEL } from "../src/models";

describe("Free vs. Paid Models", () => {
  it("should process filePath with free model and compare to paid model", async () => {
    const filePathPath = "./test/assets/trader-joes-receipt.jpg";

    const freeResult = await ocr({
      filePath: filePathPath,
      apiKey: process.env.TOGETHER_API_KEY,
      model: FREE_MODEL,
    });
    const paidResult = await ocr({
      filePath: filePathPath,
      apiKey: process.env.TOGETHER_API_KEY,
      model: DEFAULT_MODEL,
    });

    expect(freeResult).toBeTruthy();
    expect(typeof freeResult).toBe("string");
    expect(paidResult).toBeTruthy();
    expect(typeof paidResult).toBe("string");

    // Basic quality check: both should contain expected text
    expect(freeResult.toLowerCase()).toContain("trader joe");
    expect(paidResult.toLowerCase()).toContain("trader joe");
  });
});
