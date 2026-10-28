import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
import {
  WATT_CLOUD_API_KEY_ENV,
  WATT_CLOUD_DEFAULT_MODEL_REF,
  WATT_CLOUD_PROVIDER_ID,
  buildWattCloudProvider,
  resolveWattCloudDynamicModel,
} from "./catalog.js";
import { wattCloudProvider } from "./provider.js";
import { wrapWattCloudStreamFn } from "./thinking.js";

const openaiCompatibleReplayHooks = buildProviderReplayFamilyHooks({
  family: "openai-compatible",
});

export default defineSingleProviderPluginEntry({
  id: WATT_CLOUD_PROVIDER_ID,
  name: "Watt Cloud",
  description: "Watt Cloud model provider",
  provider: {
    label: "Watt Cloud",
    docsPath: "https://www.watt-cloud.com/docs/",
    envVars: [WATT_CLOUD_API_KEY_ENV],
    auth: [
      {
        methodId: "api-key",
        label: "Watt Cloud API key",
        hint: "API key from https://www.watt-cloud.com/workspaces/keys",
        optionKey: "wattCloudApiKey",
        flagName: "--watt-cloud-api-key",
        envVar: WATT_CLOUD_API_KEY_ENV,
        promptMessage: "Enter your Watt Cloud API key",
        defaultModel: WATT_CLOUD_DEFAULT_MODEL_REF,
      },
    ],
    catalog: {
      order: "simple",
      run: (ctx: Parameters<typeof wattCloudProvider.catalog.run>[0]) =>
        wattCloudProvider.catalog.run(ctx),
      buildProvider: buildWattCloudProvider,
      buildStaticProvider: buildWattCloudProvider,
      liveModelDiscovery: true,
    },
    resolveDynamicModel: (ctx: { modelId: string }) => resolveWattCloudDynamicModel(ctx.modelId),
    ...openaiCompatibleReplayHooks,
    wrapStreamFn: (ctx: { streamFn?: Parameters<typeof wrapWattCloudStreamFn>[0] }) =>
      wrapWattCloudStreamFn(ctx.streamFn),
  },
});
