"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Difficulty, FeedbackMode, Scenario } from "@/lib/types";

interface Props {
  scenariosByCategory: Record<string, Scenario[]>;
  categoryLabels: Record<string, string>;
  categoryOrder: string[];
}

export function StartClient({
  scenariosByCategory,
  categoryLabels,
  categoryOrder,
}: Props) {
  const router = useRouter();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    null,
  );
  const [customTopic, setCustomTopic] = useState("");
  const [aiRole, setAiRole] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>("natural");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flatScenarios = useMemo(
    () =>
      categoryOrder.flatMap((cat) => scenariosByCategory[cat] ?? []),
    [scenariosByCategory, categoryOrder],
  );

  function pickScenario(s: Scenario) {
    setSelectedScenarioId(s.id);
    setCustomTopic("");
    setAiRole(s.suggested_ai_role);
    setDifficulty(s.suggested_difficulty);
    setError(null);
  }

  function pickCustom() {
    setSelectedScenarioId(null);
    if (!aiRole) setAiRole("Friendly conversation partner");
    setError(null);
  }

  const readyToStart =
    (selectedScenarioId !== null ||
      (customTopic.trim().length >= 20 && customTopic.trim().length <= 500)) &&
    aiRole.trim().length > 0;

  async function startSession() {
    setSubmitting(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        aiRole: aiRole.trim(),
        difficulty,
        feedbackMode,
      };
      if (selectedScenarioId) body.scenarioId = selectedScenarioId;
      else body.customTopic = customTopic.trim();

      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error === "guest_quota_exhausted"
            ? "You've used your free guest sessions. Sign up to keep practicing."
            : data.message || data.error || "Failed to start session",
        );
      }
      router.push(`/session/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="space-y-10">
          {categoryOrder.map((cat) => {
            const list = scenariosByCategory[cat] ?? [];
            if (list.length === 0) return null;
            return (
              <div key={cat}>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
                  {categoryLabels[cat]}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {list.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => pickScenario(s)}
                      className={`text-left rounded-lg p-5 transition ${
                        selectedScenarioId === s.id
                          ? "bg-card ring-2 ring-primary"
                          : "bg-card hover:bg-muted"
                      }`}
                    >
                      <h3 className="font-serif text-lg tracking-tight mb-1">
                        {s.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {s.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
              Or bring your own
            </p>
            <div
              className={`rounded-lg p-5 transition bg-card ${
                selectedScenarioId === null && customTopic.length > 0
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              <label
                htmlFor="custom-topic"
                className="block text-sm font-medium mb-2"
              >
                Describe what you want to practice
              </label>
              <textarea
                id="custom-topic"
                value={customTopic}
                onChange={(e) => {
                  setCustomTopic(e.target.value);
                  if (e.target.value.length > 0) pickCustom();
                }}
                onFocus={pickCustom}
                rows={3}
                minLength={20}
                maxLength={500}
                placeholder="e.g. 'I want to practice pitching my side project to a stranger at a coffee shop.' (20–500 characters)"
                className="w-full rounded-md bg-background text-foreground text-sm p-3 outline-none focus:ring-2 focus:ring-primary/60 resize-y"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {customTopic.length}/500
              </p>
            </div>
          </div>
        </div>
      </section>

      {(selectedScenarioId || customTopic.length >= 20) && (
        <section className="mx-auto max-w-4xl px-6 py-10 border-t border-border">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
            Step 2 of 2 &mdash; configure your session
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="ai-role" className="block text-sm font-medium mb-2">
                AI plays the role of
              </label>
              <input
                id="ai-role"
                type="text"
                value={aiRole}
                onChange={(e) => setAiRole(e.target.value)}
                maxLength={100}
                className="w-full rounded-md bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>
            <div>
              <fieldset>
                <legend className="block text-sm font-medium mb-2">
                  Difficulty
                </legend>
                <div className="grid grid-cols-3 gap-2" role="radiogroup">
                  {(["easy", "normal", "challenging"] as Difficulty[]).map(
                    (d) => (
                      <button
                        key={d}
                        type="button"
                        role="radio"
                        aria-checked={difficulty === d}
                        onClick={() => setDifficulty(d)}
                        className={`rounded-md py-2.5 text-sm font-medium capitalize transition ${
                          difficulty === d
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted"
                        }`}
                      >
                        {d}
                      </button>
                    ),
                  )}
                </div>
              </fieldset>
            </div>
            <div className="md:col-span-2">
              <fieldset>
                <legend className="block text-sm font-medium mb-2">
                  Feedback style
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2" role="radiogroup">
                  {(
                    [
                      {
                        v: "natural" as FeedbackMode,
                        title: "Natural flow",
                        d: "AI stays in character. Feedback comes only at the end of the session.",
                      },
                      {
                        v: "coach" as FeedbackMode,
                        title: "Coach mode",
                        d: "AI may add brief suggestions during the chat. More helpful, more interrupty.",
                      },
                    ]
                  ).map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      role="radio"
                      aria-checked={feedbackMode === opt.v}
                      onClick={() => setFeedbackMode(opt.v)}
                      className={`text-left rounded-md p-4 transition ${
                        feedbackMode === opt.v
                          ? "bg-card ring-2 ring-primary"
                          : "bg-card hover:bg-muted"
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">{opt.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {opt.d}
                      </p>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          {error && (
            <p className="mt-6 text-sm text-destructive">{error}</p>
          )}

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={startSession}
              disabled={!readyToStart || submitting}
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-95 transition"
            >
              {submitting ? "Starting…" : "Start session"}
            </button>
            <p className="text-xs text-muted-foreground">
              {flatScenarios.length} scenarios · guest mode
            </p>
          </div>
        </section>
      )}
    </>
  );
}
