/**
 * Domain types. Mirror the Postgres schema in supabase/migrations/*.sql
 * and the DDL described in docs/03-architecture.md §4.
 */

export type Difficulty = "easy" | "normal" | "challenging";
export type FeedbackMode = "natural" | "coach";
export type SessionStatus = "active" | "ended" | "timed_out";
export type MessageSender = "user" | "ai" | "coach";

export type ScenarioCategory =
  | "interviews"
  | "meetings-work"
  | "small-talk"
  | "esl-fluency"
  | "difficult-conversations";

export interface Scenario {
  id: string;
  slug: string;
  category: ScenarioCategory;
  title: string;
  description: string;
  suggested_ai_role: string;
  suggested_difficulty: Difficulty;
  system_prompt_template: string;
  is_active: boolean;
  display_order: number;
}

export interface SessionRow {
  id: string;
  user_id: string | null;
  guest_cookie_hash: string | null;
  scenario_id: string | null;
  custom_topic: string | null;
  ai_role: string;
  difficulty: Difficulty;
  feedback_mode: FeedbackMode;
  status: SessionStatus;
  started_at: string;
  ended_at: string | null;
}

export interface MessageRow {
  id: string;
  session_id: string;
  sender: MessageSender;
  content: string;
  token_count: number | null;
  created_at: string;
}

export interface FeedbackReport {
  id: string;
  session_id: string;
  strengths: string[];
  growth_areas: string[];
  suggestions: string[];
  raw_report: string;
  rating: -1 | 0 | 1;
  model: string;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  generated_at: string;
}

/** Category display metadata for the UI. Order matches display grouping. */
export const CATEGORY_LABELS: Record<ScenarioCategory, string> = {
  interviews: "Interviews",
  "meetings-work": "Meetings & work",
  "small-talk": "Small talk",
  "esl-fluency": "ESL fluency",
  "difficult-conversations": "Difficult conversations",
};

export const CATEGORY_ORDER: readonly ScenarioCategory[] = [
  "interviews",
  "meetings-work",
  "small-talk",
  "esl-fluency",
  "difficult-conversations",
];
