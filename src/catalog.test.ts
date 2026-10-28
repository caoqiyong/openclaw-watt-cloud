import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  WATT_CLOUD_BASE_URL,
  WATT_CLOUD_DEFAULT_MODEL_ID,
  WATT_CLOUD_PROVIDER_ID,
  STATIC_MODELS,
  buildWattCloudProvider,
  resolveWattCloudDynamicModel,
} from "./catalog.js";

const pluginRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("watt-cloud catalog", () => {
  it("uses the documented OpenAI-compatible base URL", () => {
    expect(WATT_CLOUD_BASE_URL).toBe("https://api.watt-cloud.com/v1");
    expect(buildWattCloudProvider().baseUrl).toBe(WATT_CLOUD_BASE_URL);
    expect(buildWattCloudProvider().api).toBe("openai-completions");
  });

  it("seeds the published catalog with exact upstream model IDs", () => {
    const ids = STATIC_MODELS.map((model) => model.id);
    expect(ids).toEqual([
      "DeepSeek-V4-Flash",
      "DeepSeek-V4-Flash-0731",
      "DeepSeek-V4-Pro",
      "DeepSeek-V4.1-Flash",
      "DeepSeek-V4.1-Flash-1017",
      "GLM-5.1",
      "GLM-5.2",
      "GLM-5.3",
      "GLM-5.3-Flash",
      "Hy4-preview",
      "Kimi-K2.5",
      "Kimi-K2.7-Code",
      "Kimi-K3",
      "Kimi-K3.1-Pro",
      "MiniMax-M3",
      "Qwen3.5-122B-A10B",
      "Qwen3.5-27B",
      "Qwen3.5-35B-A3B",
      "Qwen3.5-397B-A17B",
    ]);
  });

  it("marks vision SKUs as image-capable and keeps pricing present on every model", () => {
    const byId = Object.fromEntries(STATIC_MODELS.map((model) => [model.id, model]));
    expect(byId["Kimi-K3"]?.input).toEqual(["text", "image"]);
    expect(byId["GLM-5.3-Flash"]?.input).toEqual(["text", "image"]);
    expect(byId["DeepSeek-V4-Pro"]?.input).toEqual(["text"]);
    expect(byId["GLM-5.1"]?.input).toEqual(["text"]);
    for (const model of STATIC_MODELS) {
      expect(model.reasoning).toBe(true);
      expect(model.cost.input).toBeGreaterThan(0);
      expect(model.cost.output).toBeGreaterThan(0);
      expect(model.maxTokens).toBe(Math.min(model.contextWindow, 65_536));
    }
  });

  it("resolves arbitrary upstream model IDs for the aggregator gateway", () => {
    const model = resolveWattCloudDynamicModel("GLM-5.3-preview");
    expect(model).toMatchObject({
      id: "GLM-5.3-preview",
      name: "GLM-5.3-preview",
      provider: WATT_CLOUD_PROVIDER_ID,
      api: "openai-completions",
      baseUrl: WATT_CLOUD_BASE_URL,
    });
  });

  it("reuses static metadata when a dynamic ID is already in the seed catalog", () => {
    const model = resolveWattCloudDynamicModel(WATT_CLOUD_DEFAULT_MODEL_ID);
    const seed = STATIC_MODELS.find((entry) => entry.id === WATT_CLOUD_DEFAULT_MODEL_ID);
    expect(model.contextWindow).toBe(seed?.contextWindow);
    expect(model.cost).toEqual(seed?.cost);
    expect(model.reasoning).toBe(seed?.reasoning);
  });

  it("keeps plugin manifest model IDs in sync with the runtime seed catalog", () => {
    const manifest = JSON.parse(
      readFileSync(join(pluginRoot, "openclaw.plugin.json"), "utf8"),
    ) as {
      modelCatalog?: {
        providers?: {
          "watt-cloud"?: { models?: Array<{ id: string }> };
        };
      };
    };
    const manifestIds = manifest.modelCatalog?.providers?.["watt-cloud"]?.models?.map(
      (model) => model.id,
    );
    expect(manifestIds).toEqual(STATIC_MODELS.map((model) => model.id));
  });
});
