import Together from "together-ai";
import fs from "fs";
import { ALL_VISION_MODELS, DEFAULT_MODEL, FREE_MODEL } from "./models";

/**
 * Performs OCR on an image and returns the content as Markdown.
 * @param filePath - Path to a local image file, remote image URL, or base64-encoded image data (data:image/...;base64,...)
 * @param apiKey - Together AI API key (defaults to TOGETHER_API_KEY env var)
 * @param model - Vision model to use (defaults to DEFAULT_MODEL)
 * @param prompt - Custom prompt for OCR processing
 * @returns Markdown string of the image content
 */
export async function ocr({
  filePath,
  apiKey = process.env.TOGETHER_API_KEY,
  model = DEFAULT_MODEL,
  prompt,
}: {
  filePath: string;
  apiKey?: string;
  model?: (typeof ALL_VISION_MODELS)[number] | "free";
  prompt?: string;
}) {
  const visionLLM = model === "free" ? FREE_MODEL : model;

  const together = new Together({
    apiKey,
  });

  let finalMarkdown = await getMarkDown({ together, visionLLM, filePath, prompt });

  return finalMarkdown;
}

async function getMarkDown({
  together,
  visionLLM,
  filePath,
  prompt,
}: {
  together: Together;
  visionLLM: string;
  filePath: string;
  prompt?: string;
}) {
  const systemPrompt = `Convert the provided image into Markdown format. Ensure that all content from the page is included, such as headers, footers, subtexts, images (with alt text if possible), tables, and any other elements.

  Requirements:

  - Output Only Markdown: Return solely the Markdown content without any additional explanations or comments.
  - No Delimiters: Do not use code fences or delimiters like \`\`\`markdown.
  - Complete Content: Do not omit any part of the page, including headers, footers, and subtext.
  ${prompt ? `\n\nAdditional Instructions:\n${prompt}` : ""}
  `;

  const finalImageUrl = filePath.startsWith("data:")
    ? filePath
    : isRemoteFile(filePath)
    ? filePath
    : fs.existsSync(filePath)
    ? `data:filePath/jpeg;base64,${encodeImage(filePath)}`
    : `data:filePath/jpeg;base64,${filePath}`;

  const output = await together.chat.completions.create({
    model: visionLLM,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: systemPrompt },
          {
            type: "image_url",
            image_url: {
              url: finalImageUrl,
            },
          },
        ],
      },
    ],
  });

  return output.choices[0].message.content;
}

function encodeImage(imagePath: string) {
  const imageFile = fs.readFileSync(imagePath);
  return Buffer.from(imageFile).toString("base64");
}

function isRemoteFile(filePath: string): boolean {
  return filePath.startsWith("http://") || filePath.startsWith("https://");
}
