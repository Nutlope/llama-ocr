export interface VisionModel {
  name: string;
  modelId: string;
  contextLength: number;
  parameters: string;
  free: boolean;
  default: boolean;
}

export const VISION_MODELS: VisionModel[] = [
  {
    name: "Apriel-1.5-15b-Thinker",
    modelId: "ServiceNow-AI/Apriel-1.5-15b-Thinker",
    contextLength: 131000,
    parameters: "15B",
    free: true,
    default: false,
  },
  {
    name: "Gemma 3 27B",
    modelId: "google/gemma-3-27b-it",
    contextLength: 64000,
    parameters: "27B",
    free: false,
    default: false,
  },
  {
    name: "Llama 4 Maverick",
    modelId: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    contextLength: 524288,
    parameters: "400B",
    free: false,
    default: false,
  },
  {
    name: "Gemma 3n E4B Instruct",
    modelId: "google/gemma-3n-E4B-it",
    contextLength: 32000,
    parameters: "4B",
    free: false,
    default: false,
  },
  {
    name: "Qwen2.5-VL 72B Instruct",
    modelId: "Qwen/Qwen2.5-VL-72B-Instruct",
    contextLength: 32768,
    parameters: "72B",
    free: false,
    default: false,
  },
  {
    name: "Llama 4 Scout",
    modelId: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
    contextLength: 327680,
    parameters: "109B",
    free: false,
    default: true,
  },
  {
    name: "Arcee AI Spotlight",
    modelId: "arcee_ai/arcee-spotlight",
    contextLength: 128000,
    parameters: "8.29B",
    free: false,
    default: false,
  },
  {
    name: "Gemma 3 12B",
    modelId: "google/gemma-3-12b-it",
    contextLength: 64000,
    parameters: "12B",
    free: false,
    default: false,
  },
  {
    name: "NIM Llama 3.2 11B Vision Instruct",
    modelId: "nim/meta/llama-3.2-11b-vision-instruct",
    contextLength: 128000,
    parameters: "11B",
    free: false,
    default: false,
  },
  {
    name: "NIM Llama 3.2 90B Vision Instruct",
    modelId: "nim/meta/llama-3.2-90b-vision-instruct",
    contextLength: 128000,
    parameters: "90B",
    free: false,
    default: false,
  },
  {
    name: "Gemma 3 1B",
    modelId: "google/gemma-3-1b-it",
    contextLength: 32000,
    parameters: "1B",
    free: false,
    default: false,
  },
  {
    name: "Gemma 3 4B",
    modelId: "google/gemma-3-4b-it",
    contextLength: 64000,
    parameters: "4B",
    free: false,
    default: false,
  },
];

export const DEFAULT_MODEL = VISION_MODELS.find(m => m.default)?.modelId || VISION_MODELS[0].modelId;

export const FREE_MODEL = VISION_MODELS.find(m => m.free)?.modelId || VISION_MODELS[0].modelId;

export const ALL_VISION_MODELS = [
  DEFAULT_MODEL,
  "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
  FREE_MODEL,
  "free",
] as const;
