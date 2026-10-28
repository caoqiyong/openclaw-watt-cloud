export const WATT_CLOUD_PROVIDER_ID = "watt-cloud";
export const WATT_CLOUD_BASE_URL = "https://api.watt-cloud.com/v1";
export const WATT_CLOUD_DEFAULT_MODEL_ID = "DeepSeek-V4-Pro";
export const WATT_CLOUD_DEFAULT_MODEL_REF = `${WATT_CLOUD_PROVIDER_ID}/${WATT_CLOUD_DEFAULT_MODEL_ID}`;
export const WATT_CLOUD_API_KEY_ENV = "WATT_CLOUD_API_KEY";

export type WattCloudModelInput = "text" | "image";

export type WattCloudModelCost = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};

export type WattCloudModel = {
  id: string;
  name: string;
  reasoning: boolean;
  input: WattCloudModelInput[];
  cost: WattCloudModelCost;
  contextWindow: number;
  maxTokens: number;
};

export type WattCloudProviderConfig = {
  api: "openai-completions";
  baseUrl: string;
  models: WattCloudModel[];
};

const TEXT: WattCloudModelInput[] = ["text"];
const TEXT_IMAGE: WattCloudModelInput[] = ["text", "image"];

function cost(input: number, output: number, cacheRead: number): WattCloudModelCost {
  return { input, output, cacheRead, cacheWrite: 0 };
}

function model(entry: {
  id: string;
  name: string;
  reasoning: boolean;
  input?: WattCloudModelInput[];
  inputCost: number;
  outputCost: number;
  cacheReadCost: number;
  contextWindow: number;
}): WattCloudModel {
  return {
    id: entry.id,
    name: entry.name,
    reasoning: entry.reasoning,
    input: entry.input ?? TEXT,
    cost: cost(entry.inputCost, entry.outputCost, entry.cacheReadCost),
    contextWindow: entry.contextWindow,
    maxTokens: Math.min(entry.contextWindow, 65_536),
  };
}

export const STATIC_MODELS: WattCloudModel[] = [
  model({
    id: "DeepSeek-V4-Flash",
    name: "DeepSeek V4 Flash",
    reasoning: true,
    inputCost: 0.14,
    outputCost: 0.28,
    cacheReadCost: 0.028,
    contextWindow: 1_048_576,
  }),
  model({
    id: "DeepSeek-V4-Flash-0731",
    name: "DeepSeek V4 Flash 0731",
    reasoning: true,
    inputCost: 0.44,
    outputCost: 1.32,
    cacheReadCost: 0.014,
    contextWindow: 1_048_576,
  }),
  model({
    id: "DeepSeek-V4-Pro",
    name: "DeepSeek V4 Pro",
    reasoning: true,
    inputCost: 1.6,
    outputCost: 3.38,
    cacheReadCost: 0.14,
    contextWindow: 1_048_576,
  }),
  model({
    id: "DeepSeek-V4.1-Flash",
    name: "DeepSeek V4.1 Flash",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 0.285,
    outputCost: 0.57,
    cacheReadCost: 0.006,
    contextWindow: 1_048_576,
  }),
  model({
    id: "DeepSeek-V4.1-Flash-1017",
    name: "DeepSeek V4.1 Flash 1017",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 0.3,
    outputCost: 0.6,
    cacheReadCost: 0.006,
    contextWindow: 1_048_576,
  }),
  model({
    id: "GLM-5.1",
    name: "GLM-5.1",
    reasoning: true,
    inputCost: 1.38,
    outputCost: 4.4,
    cacheReadCost: 0.26,
    contextWindow: 202_752,
  }),
  model({
    id: "GLM-5.2",
    name: "GLM-5.2",
    reasoning: true,
    inputCost: 1.4,
    outputCost: 4.4,
    cacheReadCost: 0.26,
    contextWindow: 1_048_576,
  }),
  model({
    id: "GLM-5.3",
    name: "GLM-5.3",
    reasoning: true,
    inputCost: 1.4,
    outputCost: 4.4,
    cacheReadCost: 0.26,
    contextWindow: 1_048_576,
  }),
  model({
    id: "GLM-5.3-Flash",
    name: "GLM-5.3 Flash",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 0.15,
    outputCost: 0.5,
    cacheReadCost: 0.03,
    contextWindow: 1_048_576,
  }),
  model({
    id: "Hy4-preview",
    name: "Hy4 Preview",
    reasoning: true,
    inputCost: 0.834,
    outputCost: 2.501,
    cacheReadCost: 0.042,
    contextWindow: 1_048_576,
  }),
  model({
    id: "Kimi-K2.5",
    name: "Kimi K2.5",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 0.6,
    outputCost: 3,
    cacheReadCost: 0.1,
    contextWindow: 262_144,
  }),
  model({
    id: "Kimi-K2.7-Code",
    name: "Kimi K2.7 Code",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 0.95,
    outputCost: 4,
    cacheReadCost: 0.19,
    contextWindow: 271_360,
  }),
  model({
    id: "Kimi-K3",
    name: "Kimi K3",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 3,
    outputCost: 15,
    cacheReadCost: 0.3,
    contextWindow: 1_048_576,
  }),
  model({
    id: "Kimi-K3.1-Pro",
    name: "Kimi K3.1 Pro",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 2,
    outputCost: 10,
    cacheReadCost: 0.2,
    contextWindow: 1_048_576,
  }),
  model({
    id: "MiniMax-M3",
    name: "MiniMax M3",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 0.3,
    outputCost: 1.2,
    cacheReadCost: 0.06,
    contextWindow: 524_288,
  }),
  model({
    id: "Qwen3.5-122B-A10B",
    name: "Qwen3.5 122B-A10B",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 0.4,
    outputCost: 3.2,
    cacheReadCost: 0,
    contextWindow: 262_144,
  }),
  model({
    id: "Qwen3.5-27B",
    name: "Qwen3.5 27B",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 0.3,
    outputCost: 2.4,
    cacheReadCost: 0,
    contextWindow: 262_144,
  }),
  model({
    id: "Qwen3.5-35B-A3B",
    name: "Qwen3.5 35B-A3B",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 0.25,
    outputCost: 2,
    cacheReadCost: 0,
    contextWindow: 262_144,
  }),
  model({
    id: "Qwen3.5-397B-A17B",
    name: "Qwen3.5 397B-A17B",
    reasoning: true,
    input: TEXT_IMAGE,
    inputCost: 0.6,
    outputCost: 3.6,
    cacheReadCost: 0,
    contextWindow: 262_144,
  }),
];

const STATIC_MODELS_BY_ID = new Map(STATIC_MODELS.map((entry) => [entry.id, entry]));

export function buildWattCloudProvider(): WattCloudProviderConfig {
  return {
    api: "openai-completions",
    baseUrl: WATT_CLOUD_BASE_URL,
    models: STATIC_MODELS.map((entry) => ({ ...entry, cost: { ...entry.cost }, input: [...entry.input] })),
  };
}

export function resolveWattCloudDynamicModel(modelId: string): WattCloudModel & {
  provider: typeof WATT_CLOUD_PROVIDER_ID;
  api: "openai-completions";
  baseUrl: string;
} {
  const seed = STATIC_MODELS_BY_ID.get(modelId);
  if (seed) {
    return {
      ...seed,
      cost: { ...seed.cost },
      input: [...seed.input],
      provider: WATT_CLOUD_PROVIDER_ID,
      api: "openai-completions",
      baseUrl: WATT_CLOUD_BASE_URL,
    };
  }

  return {
    id: modelId,
    name: modelId,
    provider: WATT_CLOUD_PROVIDER_ID,
    api: "openai-completions",
    baseUrl: WATT_CLOUD_BASE_URL,
    reasoning: true,
    input: [...TEXT],
    cost: cost(0, 0, 0),
    contextWindow: 128_000,
    maxTokens: 8192,
  };
}
