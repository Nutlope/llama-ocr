import Together from "together-ai";
import fs from "fs";

export function encodeImage(imagePath: string) {
  const imageFile = fs.readFileSync(imagePath);
  return Buffer.from(imageFile).toString("base64");
}

export function isRemoteFile(filePath: string): boolean {
  return filePath.startsWith("http://") || filePath.startsWith("https://");
}

export async function processWithTogetherAI({
  visionLLM,
  systemPrompt,
  finalImageUrl,
  together,
}: {
  visionLLM: string;
  systemPrompt: string;
  finalImageUrl: string;
  together: Together;
}): Promise<string> {
  try {
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
              },
            },
          ],
        },
      ],
    });

    return output.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Together API:", error);
    throw new Error("Failed to process with Together AI.");
  }
}