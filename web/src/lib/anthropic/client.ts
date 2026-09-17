import Anthropic from "@anthropic-ai/sdk";
import { serverEnv } from "@/lib/env";

/**
 * Anthropic client — server-only. See docs/03-architecture.md §7.
 * Never import this from a client component.
 */
let cached: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (!cached) {
    cached = new Anthropic({ apiKey: serverEnv().ANTHROPIC_API_KEY });
  }
  return cached;
}

/**
 * Model IDs per docs/03-architecture.md §7.1.
 * - Haiku for conversation turns (fast, cheap)
 * - Sonnet for end-of-session feedback reports (better reasoning)
 */
export const MODELS = {
  conversation: "claude-haiku-4-5-20251001",
  feedbackReport: "claude-sonnet-4-6",
} as const;

export type ModelId = (typeof MODELS)[keyof typeof MODELS];
