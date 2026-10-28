import {
  WATT_CLOUD_PROVIDER_ID,
  buildWattCloudProvider,
  resolveWattCloudDynamicModel,
  type WattCloudProviderConfig,
} from "./catalog.js";

export type WattCloudCatalogAuthContext = {
  resolveProviderApiKey: (providerId: string) => { apiKey?: string };
};

export type WattCloudCatalogResult = {
  provider: WattCloudProviderConfig & { apiKey: string };
};

export const wattCloudProvider = {
  id: WATT_CLOUD_PROVIDER_ID,
  catalog: {
    order: "simple" as const,
    async run(ctx: WattCloudCatalogAuthContext): Promise<WattCloudCatalogResult | null> {
      const apiKey = ctx.resolveProviderApiKey(WATT_CLOUD_PROVIDER_ID).apiKey;
      if (!apiKey) {
        return null;
      }
      return {
        provider: {
          ...buildWattCloudProvider(),
          apiKey,
        },
      };
    },
  },
  resolveDynamicModel(ctx: { modelId: string }) {
    return resolveWattCloudDynamicModel(ctx.modelId);
  },
};
