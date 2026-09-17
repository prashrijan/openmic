import type { SessionRow, Scenario } from "@/lib/types";

/**
 * Build the system prompt for a session. Composes:
 *   - The scenario's system_prompt_template (or the custom topic)
 *   - Role, difficulty, feedback-mode variants
 *   - Standing rules and content policy
 *
 * See docs/03-architecture.md §7.2 for the intended shape.
 */
export function buildSystemPrompt(
  session: SessionRow,
  scenario: Scenario | null,
): string {
  const scenarioBlock = scenario
    ? scenario.system_prompt_template
    : `The user wants to practice this: "${session.custom_topic}". Adopt a natural role that fits and be a realistic conversation partner for it.`;

  const difficultyDirective =
    session.difficulty === "easy"
      ? "Be friendly and encouraging. Ask short, open follow-ups. Do not push back."
      : session.difficulty === "normal"
        ? "Behave realistically for your role. Ask 1-2 follow-ups where they'd naturally occur."
        : "Push back where appropriate. Disagree, probe for weak reasoning, or interrupt off-topic drifts. Make it a real challenge — but never hostile.";

  const feedbackDirective =
    session.feedback_mode === "natural"
      ? "Stay in character throughout. Do NOT offer feedback or coaching during the session. Feedback comes only at the end."
      : "You MAY occasionally append a brief coaching note AFTER your in-character reply, using the exact format `[coach: <one short suggestion>]`. Do this at most once every 3 turns, and only when it would genuinely help. Otherwise stay in character.";

  return [
    `You are playing the role of "${session.ai_role}" in a communication practice session with a real person.`,
    "",
    "SCENARIO:",
    scenarioBlock,
    "",
    `DIFFICULTY: ${session.difficulty}`,
    difficultyDirective,
    "",
    `FEEDBACK MODE: ${session.feedback_mode}`,
    feedbackDirective,
    "",
    "STANDING RULES:",
    "- Stay in character. Never say \"As an AI...\" unless the user directly asks about your nature.",
    "- Keep responses conversational — usually 1 to 3 sentences. Longer only if the moment calls for it.",
    "- The user is practicing English communication. Be a good, genuine practice partner.",
    "- Do not correct their grammar unless you are explicitly a language coach role.",
    "",
    "CONTENT POLICY:",
    "Refuse: sexual content involving minors, encouragement of self-harm, or illegal advice.",
    "If uncomfortable, redirect the conversation in-character rather than breaking character.",
  ].join("\n");
}
