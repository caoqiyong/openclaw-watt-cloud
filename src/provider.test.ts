import { describe, expect, it } from "vitest";
import { WATT_CLOUD_PROVIDER_ID, STATIC_MODELS } from "./catalog.js";
import { wattCloudProvider } from "./provider.js";

describe("watt-cloud provider hooks", () => {
  it("returns a catalog when an API key is available", async () => {
    const result = await wattCloudProvider.catalog.run({
      resolveProviderApiKey: () => ({ apiKey: "test-key" }),
    });
    expect(result?.provider?.apiKey).toBe("test-key");
    expect(result?.provider?.models).toHaveLength(STATIC_MODELS.length);
    expect(result?.provider?.baseUrl).toBe("https://api.watt-cloud.com/v1");
  });

  it("returns null catalog when no key is available", async () => {
    const result = await wattCloudProvider.catalog.run({
      resolveProviderApiKey: () => ({ apiKey: undefined }),
    });
    expect(result).toBeNull();
  });

  it("resolves dynamic models through the provider hook", () => {
    const model = wattCloudProvider.resolveDynamicModel({ modelId: "acme-beta-v3" });
    expect(model.id).toBe("acme-beta-v3");
    expect(model.provider).toBe(WATT_CLOUD_PROVIDER_ID);
  });
});
