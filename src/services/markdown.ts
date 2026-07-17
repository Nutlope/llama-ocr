import Together from "together-ai";
import { isRemoteFile, encodeImage, processWithTogetherAI } from "../utils";
import { MARKDOWN_PROMPT } from "../prompts";

export async function getMarkDown({
  together,
  visionLLM,
  filePath,
}: {
  together: Together;
  visionLLM: string;
  filePath: string;
}) {
  const systemPrompt = MARKDOWN_PROMPT

  const finalImageUrl = isRemoteFile(filePath)
    ? filePath
    : `data:image/jpeg;base64,${encodeImage(filePath)}`;

  return processWithTogetherAI({ visionLLM, systemPrompt, finalImageUrl, together });
}