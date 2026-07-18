import Together from "together-ai";
import fs from "fs";
import { fromPath, fromBuffer } from "pdf2pic";

export async function ocr({
  filePath,
  apiKey = process.env.TOGETHER_API_KEY,
  model = "Llama-3.2-90B-Vision",
}: {
  filePath: string;
  apiKey?: string;
  model?: "Llama-3.2-90B-Vision" | "Llama-3.2-11B-Vision" | "free";
}) {
  if (!filePath) {
    throw new Error("filePath is required");
  }
  if (!apiKey) {
    throw new Error("TOGETHER_API_KEY is required either as parameter or environment variable");
  }

  const visionLLM =
    model === "free"
      ? "meta-llama/Llama-Vision-Free"
      : `meta-llama/${model}-Instruct-Turbo`;

  const together = new Together({
    apiKey,
  });

  let finalMarkdown = await getMarkDown({ together, visionLLM, filePath });

  return finalMarkdown;
}

async function getMarkDown({
  together,
  visionLLM,
  filePath,
}: {
  together: Together;
  visionLLM: string;
  filePath: string;
}) {
  const systemPrompt = `Convert the provided image into Markdown format. Ensure that all content from the page is included, such as headers, footers, subtexts, images (with alt text if possible), tables, and any other elements.

  Requirements:

  - Output Only Markdown: Return solely the Markdown content without any additional explanations or comments.
  - No Delimiters: Do not use code fences or delimiters like \`\`\`markdown.
  - Complete Content: Do not omit any part of the page, including headers, footers, and subtext.
  `;

  let finalImageUrl: string;
  
  try {
    if (filePath.toLowerCase().endsWith('.pdf')) {
      const options = {
        density: 300,
        saveFilename: "temp-pdf-page",
        format: "jpeg",
        width: 2048,
        height: 2048
      };

      if (isRemoteFile(filePath)) {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const pdfConverter = fromBuffer(Buffer.from(buffer));
        const result = await pdfConverter(1, options);
        finalImageUrl = `data:image/jpeg;base64,${result.base64}`;
      } else {
        const pdfConverter = fromPath(filePath, options);
        const result = await pdfConverter(1);
        finalImageUrl = `data:image/jpeg;base64,${result.base64}`;
      }
    } else {
      finalImageUrl = isRemoteFile(filePath)
        ? filePath
        : `data:image/jpeg;base64,${encodeImage(filePath)}`;
    }

    const output = await together.chat.completions.create({
      model: visionLLM,
      messages: [
        {
          role: "user",
          // @ts-expect-error
          content: [
            { type: "text", text: systemPrompt },
            {
              type: "image_url",
              image_url: {
                url: finalImageUrl,
                mime_type: 'image/jpeg'
              },
            },
          ],
        },
      ],
      timeout: 60000,
      max_tokens: 4096,
    });

    if (!output.choices?.[0]?.message?.content) {
      throw new Error('No content received from Together AI');
    }

    return output.choices[0].message.content;
  } catch (error) {
    throw new Error(`Failed to process image: ${error.message}`);
  }
}

function encodeImage(imagePath: string) {
  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }
    const imageFile = fs.readFileSync(imagePath);
    return Buffer.from(imageFile).toString("base64");
  } catch (error) {
    throw new Error(`Failed to encode image: ${error.message}`);
  }
}

function isRemoteFile(filePath: string): boolean {
  return filePath.startsWith("http://") || filePath.startsWith("https://");
}
