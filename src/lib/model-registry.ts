import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModelV1 } from "ai";

export type ProviderName = "OpenAI" | "Anthropic" | "Google";

export type ModelSelection = {
  model: LanguageModelV1;
  provider: ProviderName;
  modelId: string;
};

/**
 * Selects the first configured AI provider using project priority order.
 */
export function getModel(): ModelSelection {
  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return {
      model: openai("gpt-4o-mini"),
      provider: "OpenAI",
      modelId: "gpt-4o-mini"
    };
  }

  if (process.env.ANTHROPIC_API_KEY) {
    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return {
      model: anthropic("claude-sonnet-4-20250514"),
      provider: "Anthropic",
      modelId: "claude-sonnet-4-20250514"
    };
  }

  if (process.env.GOOGLE_API_KEY) {
    const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
    return {
      model: google("gemini-2.5-flash"),
      provider: "Google",
      modelId: "gemini-2.5-flash"
    };
  }

  throw new Error("No AI provider configured");
}
