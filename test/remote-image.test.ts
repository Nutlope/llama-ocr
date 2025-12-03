import { describe, it, expect } from "vitest";
import { ocr } from "../src/index";

describe("Remote filePath URL", () => {
  it("should perform OCR on remote filePath", async () => {
    const markdown = await ocr({
      filePath: "https://i.ibb.co/6cjLQ6yp/Receipt-Swiss.jpg",
      apiKey: process.env.TOGETHER_API_KEY,
    });
    expect(markdown).toBeTruthy();
    expect(typeof markdown).toBe("string");
  });

  it("should perform OCR on transparent filePath", async () => {
    const markdown = await ocr({
      filePath:
        "https://i.ibb.co/S7W2Pg4D/out-download-6-gif-removebg-preview.png",
      apiKey: process.env.TOGETHER_API_KEY,
    });
    expect(markdown).toContain("120");
    expect(markdown).toBeTruthy();
    expect(typeof markdown).toBe("string");
  });

  it("should perform OCR on private GitHub filePath with custom prompt", async () => {
    const markdown = await ocr({
      filePath:
        "https://i.ibb.co/BVxSRnx0/419553079-5cc4b280-5642-46a5-bb6c-657750b32a82.png",
      apiKey: process.env.TOGETHER_API_KEY,
      prompt: `- Language Support: Recognize and accurately process Farsi (Persian) text, ensuring proper handling of right-to-left (RTL) text direction. Preserve Farsi characters and diacritics without alternations.
- Formatting: Maintain proper formatting for RTL content, such as aligning text to the right for Farsi.`,
    });
    console.log("markdown", markdown);
    expect(markdown).toBeTruthy();
    expect(typeof markdown).toBe("string");
  });
});
