import { describe, it, expect } from "vitest";
import { ocr } from "../src/index";
import { base64ImageLandscape } from "./assets/base64ImageLandscape";

describe("Invalid API key", () => {
  it("should throw error with invalid API key", async () => {
    await expect(ocr({
      filePath: base64ImageLandscape.trim(),
      apiKey: "invalid-api-key",
    })).rejects.toThrow();
  });
});