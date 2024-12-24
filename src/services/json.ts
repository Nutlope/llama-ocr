import Together from "together-ai";
import Ajv from "ajv";
import { isRemoteFile, encodeImage, processWithTogetherAI } from "../utils";
import { JSON_DEFAULT_PROMPT, JSON_STRUCTURED_PROMPT } from "../prompts";
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function validateJsonStructure(output: any, expected: Record<string, any>): boolean {
  const ajv = new Ajv();

  function createSchemaFromStructure(structure: Record<string, any>): any {
    const properties: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(structure)) {
      if (typeof value === 'object' && value !== null) {
        properties[key] = createSchemaFromStructure(value);
      } else {
        properties[key] = { type: typeof value };
      }
    }

    return {
      type: 'object',
      required: Object.keys(structure),
      properties,
      additionalProperties: false
    };
  }

  const schema = createSchemaFromStructure(expected);
  const validate = ajv.compile(schema);
  
  return validate(output);
}

function extractJsonFromString(str: string): string {
  const codeBlockMatch = str.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1];
  }
  return str;
}

function parseJsonSafely(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    const extractedJson = extractJsonFromString(jsonString);
    try {
      return JSON.parse(extractedJson);
    } catch (innerError) {
      throw new Error(`Failed to parse JSON: ${innerError.message}\nOriginal string: ${jsonString}`);
    }
  }
}

export async function getJson({
  together,
  visionLLM,
  filePath,
  jsonStructure = null,
}: {
  together: Together;
  visionLLM: string;
  filePath: string;
  jsonStructure?: Record< string | number | symbol, JsonValue> | null;
}) {
  const finalImageUrl = isRemoteFile(filePath)
    ? filePath
    : `data:image/jpeg;base64,${encodeImage(filePath)}`;

  if (!jsonStructure) {
    const systemPrompt = JSON_DEFAULT_PROMPT
    const result = await processWithTogetherAI({
      visionLLM,
      systemPrompt,
      finalImageUrl,
      together,
    });
    console.log("this is the result from the model: \n ", result);

    return parseJsonSafely(result);
  }

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    let structuredPrompt = JSON_STRUCTURED_PROMPT(jsonStructure)
    console.log(structuredPrompt)
    try {
      const result = await processWithTogetherAI({
        visionLLM,
        systemPrompt : structuredPrompt,
        finalImageUrl,
        together,
      });

      const jsonResult = parseJsonSafely(result);
      console.log("this is the result from the model: \n ", jsonResult);
      
      if (validateJsonStructure(jsonResult, jsonStructure)) {
        return jsonResult;
      }
      
      attempts++;
    } catch (error) {
      attempts++;
      if (attempts === maxAttempts) {
        throw new Error("Failed to generate JSON in specified format after maximum retries");
      }
    }
  }

  throw new Error("Failed to generate JSON in specified format after maximum retries");
}