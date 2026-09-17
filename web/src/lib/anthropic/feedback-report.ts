import { z } from "zod";
import { anthropic, MODELS } from "@/lib/anthropic/client";
import type { MessageRow, Scenario, SessionRow } from "@/lib/types";

/**
 * End-of-session feedback report generation. Uses Claude Sonnet.
 * See docs/03-architecture.md §7.3 for the intended shape.
 */

export const feedbackReportSchema = z.object({
  strengths: z.array(z.string().min(1).max(300)).min(1).max(5),
  growth_areas: z.array(z.string().min(1).max(300)).min(1).max(5),
  suggestions: z.array(z.string().min(1).max(300)).min(1).max(5),
});

export type FeedbackReportContent = z.infer<typeof feedbackReportSchema>;

export interface FeedbackReportResult {
  content: FeedbackReportContent;
  raw: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
}

const SYSTEM = `You are a warm, specific, non-preachy communication coach. You just observed a practice conversation between a person practicing English communication and an AI partner playing a role. Analyze the CONVERSATION and produce a short feedback report for the user.

RULES:
- Total length across all fields <= 300 words.
- 2 to 3 strengths — be specific. Reference what they actually said or did (paraphrase, do not always quote directly).
- 2 to 3 growth areas — concrete, actionable. Not generic advice.
- 1 to 3 suggestions — specific things to try next time.
- Do NOT be preachy. Do NOT be generic. If the session was mostly fine, say so plainly.
- Address the user directly as "you". Warm but not saccharine.
- Do not mention the AI or the scenario setup. The user knows what they practiced.

OUTPUT:
Return ONLY a JSON object matching this exact shape (no prose, no markdown fence):

{
  "strengths": ["..."],
  "growth_areas": ["..."],
  "suggestions": ["..."]
}`;

/**
 * Generate a feedback report for a completed session.
 * Retries once on JSON parse failure with a stricter instruction.
 */
export async function generateFeedbackReport(
  session: SessionRow,
  scenario: Scenario | null,
  messages: MessageRow[],
): Promise<FeedbackReportResult> {
  const transcript = buildTranscriptForCoach(session, scenario, messages);

  const first = await callModel(transcript, /* stricter */ false);
  const firstParsed = safeParseReport(first.text);
  if (firstParsed.success) {
    return {
      content: firstParsed.data,
      raw: first.text,
      model: MODELS.feedbackReport,
      promptTokens: first.promptTokens,
      completionTokens: first.completionTokens,
    };
  }

  // Retry once with an explicit instruction to fix the output
  const second = await callModel(transcript, /* stricter */ true);
  const secondParsed = safeParseReport(second.text);
  if (secondParsed.success) {
    return {
      content: secondParsed.data,
      raw: second.text,
      model: MODELS.feedbackReport,
      promptTokens: first.promptTokens + second.promptTokens,
      completionTokens: first.completionTokens + second.completionTokens,
    };
  }

  throw new Error(
    "Feedback report could not be parsed after retry. Raw output: " +
      second.text.slice(0, 500),
  );
}

async function callModel(
  transcript: string,
  stricter: boolean,
): Promise<{ text: string; promptTokens: number; completionTokens: number }> {
  const userContent = stricter
    ? `The last response was not valid JSON matching the required schema. Return ONLY the JSON object, nothing else — no prose, no code fence.\n\n${transcript}`
    : transcript;

  const response = await anthropic().messages.create({
    model: MODELS.feedbackReport,
    max_tokens: 800,
    system: [
      {
        type: "text",
        text: SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userContent }],
  });

  const textBlocks = response.content.filter((b) => b.type === "text");
  const text = textBlocks.map((b) => b.text).join("").trim();

  return {
    text,
    promptTokens: response.usage.input_tokens,
    completionTokens: response.usage.output_tokens,
  };
}

function buildTranscriptForCoach(
  session: SessionRow,
  scenario: Scenario | null,
  messages: MessageRow[],
): string {
  const setup = scenario
    ? `Scenario: ${scenario.title}\nAI played: ${session.ai_role}\nDifficulty: ${session.difficulty}`
    : `Custom topic: ${session.custom_topic}\nAI played: ${session.ai_role}\nDifficulty: ${session.difficulty}`;

  const turns = messages
    .filter((m) => m.sender === "user" || m.sender === "ai")
    .map((m) => {
      const label = m.sender === "user" ? "USER" : "PARTNER";
      // Strip [coach: ...] annotations from the AI turns before analysis
      const cleaned = m.content.replace(/\[coach:[^\]]*\]/g, "").trim();
      return `${label}: ${cleaned}`;
    })
    .join("\n\n");

  return `${setup}\n\nCONVERSATION:\n\n${turns}\n\nGenerate the feedback report as strict JSON.`;
}

function safeParseReport(
  raw: string,
):
  | { success: true; data: FeedbackReportContent }
  | { success: false; error: string } {
  // Strip a possible ```json ... ``` fence just in case
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }

  const result = feedbackReportSchema.safeParse(parsed);
  if (!result.success) {
    return { success: false, error: result.error.message };
  }
  return { success: true, data: result.data };
}
