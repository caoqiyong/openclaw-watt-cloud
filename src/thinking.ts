type WattCloudThinkingOptions = {
  thinkingLevel?: unknown;
  reasoningEffort?: unknown;
  reasoning?: unknown;
};

type WattCloudStreamOptions = WattCloudThinkingOptions & {
  onPayload?: (payload: Record<string, unknown>, model?: unknown) => unknown;
  [key: string]: unknown;
};

type WattCloudStreamFn = (
  model: unknown,
  context: unknown,
  options?: WattCloudStreamOptions,
) => unknown;

export function applyWattCloudThinking(payload: Record<string, unknown>, enabled: boolean): void {
  const existing = payload.chat_template_kwargs;
  if (existing && typeof existing === "object" && !Array.isArray(existing)) {
    payload.chat_template_kwargs = {
      ...(existing as Record<string, unknown>),
      thinking: enabled,
    };
    return;
  }
  payload.chat_template_kwargs = { thinking: enabled };
}

export function resolveWattCloudThinkingEnabled(options: WattCloudThinkingOptions = {}): boolean {
  const raw = options.reasoningEffort ?? options.reasoning ?? options.thinkingLevel ?? "high";
  if (typeof raw !== "string") {
    return true;
  }
  const normalized = raw.trim().toLowerCase();
  return normalized !== "off" && normalized !== "none";
}

export function wrapWattCloudStreamFn(
  streamFn: WattCloudStreamFn | undefined,
): WattCloudStreamFn | undefined {
  if (!streamFn) {
    return undefined;
  }
  return (model, context, options) => {
    const originalOnPayload = options?.onPayload;
    return streamFn(model, context, {
      ...options,
      async onPayload(payload, payloadModel) {
        const replacement = await originalOnPayload?.(payload, payloadModel);
        const finalPayload =
          replacement && typeof replacement === "object"
            ? (replacement as Record<string, unknown>)
            : payload;
        applyWattCloudThinking(finalPayload, resolveWattCloudThinkingEnabled(options ?? {}));
        return finalPayload;
      },
    });
  };
}
