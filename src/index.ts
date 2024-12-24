import Together from "together-ai";
import { getMarkDown } from "./services/markdown";
import { getJson } from "./services/json";
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export async function ocr({
  filePath,
  apiKey = process.env.TOGETHER_API_KEY,
  model = "Llama-3.2-90B-Vision",
  outputFormat = "markdown",
  jsonStructure,
}: {
  filePath: string;
  apiKey?: string;
  model?: "Llama-3.2-90B-Vision" | "Llama-3.2-11B-Vision" | "free";
  outputFormat?: "markdown" | "json";
  jsonStructure?: Record<string | number | symbol, JsonValue>;
}) {
  const visionLLM =
    model === "free"
      ? "meta-llama/Llama-Vision-Free"
      : `meta-llama/${model}-Instruct-Turbo`;

  const together = new Together({
    apiKey,
  });

  try {
    switch (outputFormat) {
      case "json":
        return await getJson({ together, visionLLM, filePath, jsonStructure });
      case "markdown":
        return await getMarkDown({ together, visionLLM, filePath });
      default:
        throw new Error(`Unsupported output format: ${outputFormat}`);
    }
  } catch (error) {
    throw new Error(`OCR processing failed: ${error.message}`);
  }
}