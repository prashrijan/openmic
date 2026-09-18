"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import type {
  Difficulty,
  FeedbackMode,
  Scenario,
  ScenarioCategory,
} from "@/lib/types";

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
        if (data.error === "guest_quota_exhausted") {
          router.push("/login?reason=quota&next=%2Fstart");
          return;
        }
        throw new Error(data.message || data.error || "Failed to start session");
      }
      router.push(`/session/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-4 pb-16 md:pb-20">
        <div className="space-y-14 md:space-y-16">
          {categoryOrder.map((cat) => {
            const list = scenariosByCategory[cat] ?? [];
            if (list.length === 0) return null;
            return (
              <div key={cat}>
                <div className="flex items-baseline justify-between gap-4 mb-6 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-card text-primary">
                      <CategoryIcon
                        category={cat as ScenarioCategory}
                        className="w-4 h-4"
                      />
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
                      {categoryLabels[cat]}
                    </h2>
                  </div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {list.length} scenario{list.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => {
                    const selected = selectedScenarioId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => pickScenario(s)}
                        className={`text-left rounded-lg p-6 transition group ${
                          selected
                            ? "bg-card ring-2 ring-primary"
                            : "bg-card/60 hover:bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {s.suggested_difficulty}
                          </p>
                          <span
                            aria-hidden
                            className={`inline-block w-2 h-2 rounded-full transition ${
                              selected ? "bg-primary" : "bg-border group-hover:bg-primary/40"
                            }`}
                          />
                        </div>
                        <h3 className="font-serif text-xl leading-snug tracking-tight mb-2">
                          {s.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {s.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Custom topic — featured treatment */}
          <div>
            <div className="flex items-baseline justify-between gap-4 mb-6 pb-4 border-b border-border">
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
                Or bring your own
              </h2>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Custom
              </p>
            </div>
            <div
              className={`rounded-lg p-6 md:p-8 transition ${
                selectedScenarioId === null && customTopic.length > 0
                  ? "bg-card ring-2 ring-primary"
                  : "bg-card/60"
              }`}
            >
              <label
                htmlFor="custom-topic"
                className="block font-serif text-lg tracking-tight mb-3"
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
                rows={4}
                minLength={20}
                maxLength={500}
                placeholder="e.g. 'I want to practice pitching my side project to a stranger at a coffee shop.'"
                className="w-full rounded-md bg-background text-foreground text-base p-4 outline-none focus:ring-2 focus:ring-primary/60 resize-y leading-relaxed"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {customTopic.length}/500 &middot; needs at least 20 characters
              </p>
            </div>
          </div>
        </div>
      </section>

      {(selectedScenarioId || customTopic.length >= 20) && (
        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 border-t border-border">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-4 inline-flex items-center gap-3">
            <span className="w-8 h-px bg-primary" />
            Step 2 of 2 &mdash; configure your session
          </p>
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight leading-tight mb-8 max-w-2xl">
            Set the shape of the conversation.
          </h2>

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
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-95 transition"
            >
              {submitting ? "Starting…" : "Start session"}
              {!submitting && (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              )}
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
