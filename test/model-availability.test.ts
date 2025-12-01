import { describe, it, expect } from "vitest";
import { ocr } from "../src/index";

describe("Model Availability", () => {
  it("should throw error for invalid model ID", async () => {
    const invalidModel = "invalid-model-123";
    const imagePath = "./test/assets/trader-joes-receipt.jpg";

    await expect(
      ocr({
        filePath: imagePath,
        apiKey: process.env.TOGETHER_API_KEY,
        model: invalidModel,
      })
    ).rejects.toThrow();
  });

  it("should handle unavailable model gracefully", async () => {
    const unavailableModel = "meta-llama/llama-3-8b-instruct"; // Example of a potentially unavailable model
    const imagePath = "./test/assets/trader-joes-receipt.jpg";

    await expect(
      ocr({
        filePath: imagePath,
        apiKey: process.env.TOGETHER_API_KEY,
        model: unavailableModel,
      })
    ).rejects.toThrow();
  });
});
