// @vitest-environment node
import { describe, expect, it } from "vitest";
import { feedbackReportSchema } from "./feedback-report";

describe("feedbackReportSchema", () => {
  it("accepts a valid report", () => {
    const result = feedbackReportSchema.safeParse({
      strengths: ["You listened before responding."],
      growth_areas: ["Try opening with a stronger hook."],
      suggestions: ["Rehearse the first 20 seconds out loud."],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty arrays", () => {
    const result = feedbackReportSchema.safeParse({
      strengths: [],
      growth_areas: ["something"],
      suggestions: ["something"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects too many items", () => {
    const result = feedbackReportSchema.safeParse({
      strengths: Array.from({ length: 6 }, (_, i) => `s${i}`),
      growth_areas: ["a"],
      suggestions: ["a"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects overly long items", () => {
    const result = feedbackReportSchema.safeParse({
      strengths: ["a".repeat(301)],
      growth_areas: ["a"],
      suggestions: ["a"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing required field", () => {
    const result = feedbackReportSchema.safeParse({
      strengths: ["ok"],
      growth_areas: ["ok"],
      // suggestions missing
    });
    expect(result.success).toBe(false);
  });

  it("rejects extra unrelated shapes", () => {
    const result = feedbackReportSchema.safeParse({
      hello: "world",
    });
    expect(result.success).toBe(false);
  });
});
