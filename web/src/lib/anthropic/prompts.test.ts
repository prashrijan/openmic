// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "./prompts";
import type { Scenario, SessionRow } from "@/lib/types";

const baseSession: SessionRow = {
  id: "session-1",
  user_id: null,
  guest_cookie_hash: "hash-1",
  scenario_id: "scenario-1",
  custom_topic: null,
  ai_role: "Interviewer",
  difficulty: "normal",
  feedback_mode: "natural",
  status: "active",
  started_at: "2026-09-17T10:00:00Z",
  ended_at: null,
};

const baseScenario: Scenario = {
  id: "scenario-1",
  slug: "behavioral-interview",
  category: "interviews",
  title: "Behavioral interview",
  description: "A behavioral interview session",
  suggested_ai_role: "Interviewer",
  suggested_difficulty: "normal",
  system_prompt_template:
    "You are conducting a behavioral interview using STAR-format questions.",
  is_active: true,
  display_order: 10,
};

describe("buildSystemPrompt", () => {
  it("uses the scenario system_prompt_template when a scenario is present", () => {
    const prompt = buildSystemPrompt(baseSession, baseScenario);
    expect(prompt).toContain("STAR-format questions");
    expect(prompt).not.toContain("custom_topic");
  });

  it("uses custom topic phrasing when no scenario", () => {
    const session: SessionRow = {
      ...baseSession,
      scenario_id: null,
      custom_topic: "I want to practice pitching my side project",
    };
    const prompt = buildSystemPrompt(session, null);
    expect(prompt).toContain("pitching my side project");
    expect(prompt).toContain("Adopt a natural role");
  });

  it("names the AI role in the opening line", () => {
    const prompt = buildSystemPrompt(
      { ...baseSession, ai_role: "Skeptical VP" },
      baseScenario,
    );
    expect(prompt).toMatch(/role of "Skeptical VP"/);
  });

  it("emits distinct difficulty directives", () => {
    const easy = buildSystemPrompt(
      { ...baseSession, difficulty: "easy" },
      baseScenario,
    );
    const normal = buildSystemPrompt(baseSession, baseScenario);
    const hard = buildSystemPrompt(
      { ...baseSession, difficulty: "challenging" },
      baseScenario,
    );

    expect(easy).toContain("friendly and encouraging");
    expect(normal).toContain("realistically for your role");
    expect(hard).toContain("Push back");
    // Make sure they're not all identical to each other
    expect(easy).not.toBe(normal);
    expect(normal).not.toBe(hard);
  });

  it("forbids in-conversation feedback under natural mode", () => {
    const prompt = buildSystemPrompt(
      { ...baseSession, feedback_mode: "natural" },
      baseScenario,
    );
    expect(prompt).toMatch(/do not offer feedback/i);
    expect(prompt).not.toContain("[coach:");
  });

  it("permits inline [coach: ...] nudges under coach mode", () => {
    const prompt = buildSystemPrompt(
      { ...baseSession, feedback_mode: "coach" },
      baseScenario,
    );
    expect(prompt).toContain("[coach:");
    expect(prompt).toContain("at most once every 3 turns");
  });

  it("always includes the standing rules and content policy", () => {
    const prompt = buildSystemPrompt(baseSession, baseScenario);
    expect(prompt).toContain("STANDING RULES");
    expect(prompt).toContain("Stay in character");
    expect(prompt).toContain("CONTENT POLICY");
    expect(prompt).toContain("minors");
  });
});
