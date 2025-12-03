import Together from "together-ai";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import { ALL_VISION_MODELS, DEFAULT_MODEL, FREE_MODEL } from "./models";

/**
 * Performs OCR on an image or PDF and returns the content as Markdown.
 * @param filePath - Path to a local image file, remote image URL, base64-encoded image data (data:image/...;base64,...), or PDF file/URL/base64
 * @param apiKey - Together AI API key (defaults to TOGETHER_API_KEY env var)
 * @param model - Vision model to use (defaults to DEFAULT_MODEL)
 * @param prompt - Custom prompt for OCR processing
 * @param maxPages - Maximum number of PDF pages to process (default: 5)
 * @returns Markdown string of the image/PDF content
 */
export async function ocr({
  filePath,
  apiKey = process.env.TOGETHER_API_KEY,
  model = DEFAULT_MODEL,
  prompt,
  maxPages = 5,
}: {
  filePath: string;
  apiKey?: string;
  model?: (typeof ALL_VISION_MODELS)[number] | "free";
  prompt?: string;
  maxPages?: number;
}) {
  const visionLLM = model === "free" ? FREE_MODEL : model;

  const together = new Together({
    apiKey,
  });

  let finalMarkdown: string;

  if (isPdf(filePath)) {
    const pdfOptions: any = {};
    if (filePath.startsWith('data:application/pdf;base64,')) {
      const base64 = filePath.split(',')[1];
      pdfOptions.data = Buffer.from(base64, 'base64');
    } else if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      pdfOptions.url = filePath;
    } else {
      pdfOptions.data = fs.readFileSync(filePath);
    }

    const parser = new PDFParse(pdfOptions);
    const info = await parser.getInfo();
    const totalPages = Math.min(info.total, maxPages);
    const screenshots = await parser.getScreenshot({
      partial: Array.from({ length: totalPages }, (_, i) => i + 1),
      imageDataUrl: true,
    });
    await parser.destroy();

    const results: string[] = [];
    for (let i = 0; i < screenshots.pages.length; i++) {
      const page = screenshots.pages[i];
      const markdown = await getMarkDown({ together, visionLLM, filePath: page.dataUrl, prompt });
      results.push(`--- Page ${i + 1} ---\n\n${markdown}`);
    }
    finalMarkdown = results.join('\n\n');
  } else {
    finalMarkdown = await getMarkDown({ together, visionLLM, filePath, prompt });
  }

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
    ? `data:image/jpeg;base64,${encodeImage(filePath)}`
    : `data:image/jpeg;base64,${filePath}`;

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

function isPdf(filePath: string): boolean {
  return filePath.endsWith('.pdf') || filePath.startsWith('data:application/pdf;base64,');
}
