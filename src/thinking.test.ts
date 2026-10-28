import { describe, expect, it } from "vitest";
import {
  applyWattCloudThinking,
  resolveWattCloudThinkingEnabled,
  wrapWattCloudStreamFn,
} from "./thinking.js";

describe("watt-cloud thinking payload", () => {
  it("writes chat_template_kwargs.thinking as documented by Watt Cloud", () => {
    const payload: Record<string, unknown> = {};
    applyWattCloudThinking(payload, true);
    expect(payload.chat_template_kwargs).toEqual({ thinking: true });
  });

  it("preserves other chat-template kwargs when toggling thinking", () => {
    const payload: Record<string, unknown> = {
      chat_template_kwargs: { custom_flag: "keep" },
    };
    applyWattCloudThinking(payload, false);
    expect(payload.chat_template_kwargs).toEqual({
      custom_flag: "keep",
      thinking: false,
    });
  });

  it("treats off/none as disabled and other levels as enabled", () => {
    expect(resolveWattCloudThinkingEnabled({ thinkingLevel: "off" })).toBe(false);
    expect(resolveWattCloudThinkingEnabled({ reasoning: "none" })).toBe(false);
    expect(resolveWattCloudThinkingEnabled({ thinkingLevel: "high" })).toBe(true);
    expect(resolveWattCloudThinkingEnabled({})).toBe(true);
  });

  it("patches chat_template_kwargs on the outbound stream payload", async () => {
    const seen: Record<string, unknown>[] = [];
    const streamFn = (
      _model: unknown,
      _context: unknown,
      options?: {
        thinkingLevel?: string;
        onPayload?: (payload: Record<string, unknown>) => unknown;
      },
    ) => {
      const payload: Record<string, unknown> = { model: "DeepSeek-V4-Pro" };
      return Promise.resolve(options?.onPayload?.(payload)).then(() => {
        seen.push(payload);
        return { ok: true };
      });
    };

    const wrapped = wrapWattCloudStreamFn(streamFn);
    await wrapped?.({}, {}, { thinkingLevel: "off" });
    expect(seen[0]?.chat_template_kwargs).toEqual({ thinking: false });
  });
});
