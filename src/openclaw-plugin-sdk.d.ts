/**
 * Ambient type declarations for `openclaw/plugin-sdk` subpaths that ship
 * without `.d.ts` files in the published package (their exports map entries
 * have no `types` condition). Shapes mirror the documented plugin SDK
 * contract; replace this file with upstream types when they become available.
 */

declare module "openclaw/plugin-sdk/provider-entry" {
  export interface SingleProviderAuthMethod {
    methodId: string;
    label: string;
    hint?: string;
    optionKey: string;
    flagName: string;
    envVar: string;
    promptMessage: string;
    defaultModel: string;
  }

  export type ProviderCatalogContext = {
    resolveProviderApiKey(providerId: string): { apiKey?: string };
    resolveProviderAuth(providerId: string): { apiKey?: string; discoveryApiKey?: string };
  };

  export type ProviderCatalogResult = { provider: unknown };

  export interface SingleProviderCatalog {
    order?: "simple" | "profile" | "paired" | "late";
    run(
      ctx: ProviderCatalogContext,
    ): Promise<ProviderCatalogResult | null> | ProviderCatalogResult | null;
    buildProvider?(): unknown;
    buildStaticProvider?(): unknown;
    liveModelDiscovery?: boolean | Record<string, unknown>;
  }

  export interface SingleProviderDefinition {
    id: string;
    name: string;
    description?: string;
    provider: {
      label: string;
      docsPath?: string;
      envVars?: string[];
      auth?: SingleProviderAuthMethod[];
      catalog?: SingleProviderCatalog;
      resolveDynamicModel?(ctx: { modelId: string }): unknown;
      wrapStreamFn?(ctx: { streamFn?: unknown }): unknown;
      [hook: string]: unknown;
    };
  }

  export function defineSingleProviderPluginEntry(
    config: SingleProviderDefinition,
  ): unknown;
}

declare module "openclaw/plugin-sdk/provider-model-shared" {
  export type ProviderReplayFamily =
    | "openai-compatible"
    | "anthropic-by-model"
    | "native-anthropic-by-model"
    | "google-gemini"
    | "passthrough-gemini"
    | "hybrid-anthropic-openai";

  export function buildProviderReplayFamilyHooks(options: {
    family: ProviderReplayFamily;
  }): Record<string, unknown>;
}
