// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createSessionSchema } from "./session-config";

const validAiRole = "Interviewer";

describe("createSessionSchema", () => {
  it("accepts a scenario-based session config", () => {
    const result = createSessionSchema.safeParse({
      scenarioId: crypto.randomUUID(),
      aiRole: validAiRole,
      difficulty: "normal",
      feedbackMode: "natural",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a custom-topic session config", () => {
    const result = createSessionSchema.safeParse({
      customTopic:
        "I want to practice explaining my project to non-technical people.",
      aiRole: validAiRole,
      difficulty: "easy",
      feedbackMode: "coach",
    });
    expect(result.success).toBe(true);
  });

  it("rejects when neither scenarioId nor customTopic is provided", () => {
    const result = createSessionSchema.safeParse({
      aiRole: validAiRole,
      difficulty: "normal",
      feedbackMode: "natural",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when both scenarioId and customTopic are provided", () => {
    const result = createSessionSchema.safeParse({
      scenarioId: crypto.randomUUID(),
      customTopic: "I want to practice explaining my project.",
      aiRole: validAiRole,
      difficulty: "normal",
      feedbackMode: "natural",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a scenarioId that isn't a UUID", () => {
    const result = createSessionSchema.safeParse({
      scenarioId: "not-a-uuid",
      aiRole: validAiRole,
      difficulty: "normal",
      feedbackMode: "natural",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a customTopic that is too short", () => {
    const result = createSessionSchema.safeParse({
      customTopic: "too short",
      aiRole: validAiRole,
      difficulty: "normal",
      feedbackMode: "natural",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a customTopic that exceeds 500 characters", () => {
    const result = createSessionSchema.safeParse({
      customTopic: "a".repeat(501),
      aiRole: validAiRole,
      difficulty: "normal",
      feedbackMode: "natural",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an ai role over 100 characters", () => {
    const result = createSessionSchema.safeParse({
      customTopic: "This is a custom topic long enough to be valid.",
      aiRole: "a".repeat(101),
      difficulty: "normal",
      feedbackMode: "natural",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown difficulty", () => {
    const result = createSessionSchema.safeParse({
      scenarioId: crypto.randomUUID(),
      aiRole: validAiRole,
      difficulty: "impossible",
      feedbackMode: "natural",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown feedback mode", () => {
    const result = createSessionSchema.safeParse({
      scenarioId: crypto.randomUUID(),
      aiRole: validAiRole,
      difficulty: "normal",
      feedbackMode: "critic",
    });
    expect(result.success).toBe(false);
  });
});
