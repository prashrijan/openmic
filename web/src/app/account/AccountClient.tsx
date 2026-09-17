"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { FeedbackMode, ScenarioCategory } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/types";

interface Props {
  initialDisplayName: string;
  initialGoals: ScenarioCategory[];
  initialFeedbackMode: FeedbackMode;
}

export function AccountClient({
  initialDisplayName,
  initialGoals,
  initialFeedbackMode,
}: Props) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [goals, setGoals] = useState<ScenarioCategory[]>(initialGoals);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>(initialFeedbackMode);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function toggleGoal(g: ScenarioCategory) {
    setGoals((prev) => {
      if (prev.includes(g)) return prev.filter((x) => x !== g);
      if (prev.length >= 5) return prev;
      return [...prev, g];
    });
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim() || null,
          practiceGoals: goals,
          preferredFeedbackMode: feedbackMode,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? `Save failed (${res.status})`);
      setProfileMsg({ kind: "ok", text: "Saved." });
      router.refresh();
    } catch (err) {
      setProfileMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Save failed",
      });
    } finally {
      setProfileSaving(false);
    }
  }

  async function deleteAccount() {
    if (deleteConfirmation !== "DELETE") return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error ?? `Delete failed (${res.status})`);
      }
      router.push("/?goodbye=1");
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
    }
  }

  return (
    <>
      <section className="mx-auto max-w-2xl px-6 py-8">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
          Profile
        </p>

        <form onSubmit={saveProfile} className="space-y-6">
          <div>
            <label htmlFor="display-name" className="block text-sm font-medium mb-2">
              Display name
            </label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
              className="w-full rounded-md bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-primary/60"
              placeholder="(optional)"
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-medium mb-2">
              What do you want to practice? (up to 5)
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {CATEGORY_ORDER.map((cat) => {
                const active = goals.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleGoal(cat)}
                    aria-pressed={active}
                    className={`text-left rounded-md p-3 text-sm transition ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-muted"
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="block text-sm font-medium mb-2">
              Default feedback style
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {(["natural", "coach"] as FeedbackMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFeedbackMode(m)}
                  aria-pressed={feedbackMode === m}
                  className={`rounded-md py-2.5 text-sm font-medium transition ${
                    feedbackMode === m
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted"
                  }`}
                >
                  {m === "natural" ? "Natural flow" : "Coach mode"}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={profileSaving}
              className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60 hover:brightness-95 transition"
            >
              {profileSaving ? "Saving…" : "Save changes"}
            </button>
            {profileMsg && (
              <p
                className={`text-sm ${
                  profileMsg.kind === "ok"
                    ? "text-[color:var(--color-success)]"
                    : "text-destructive"
                }`}
              >
                {profileMsg.text}
              </p>
            )}
          </div>
        </form>
      </section>

      {/* Delete account */}
      <section className="mx-auto max-w-2xl px-6 py-12 border-t border-border">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
          Delete account
        </p>
        <h2 className="font-serif text-xl tracking-tight mb-2">
          This can&rsquo;t be undone.
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mb-5">
          Deletes your profile, every session, every transcript, and every
          feedback report. Guest cookies aren&rsquo;t affected, but there
          won&rsquo;t be any user record to associate them with anymore.
        </p>

        <div className="space-y-3">
          <label htmlFor="del-confirm" className="block text-sm font-medium">
            Type <span className="font-mono">DELETE</span> to confirm
          </label>
          <input
            id="del-confirm"
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            className="w-full max-w-sm rounded-md bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-destructive/60"
            placeholder="DELETE"
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={deleteAccount}
              disabled={deleteConfirmation !== "DELETE" || deleting}
              className="rounded-md bg-destructive text-primary-foreground px-5 py-3 text-sm font-medium disabled:opacity-40 hover:brightness-95 transition"
            >
              {deleting ? "Deleting…" : "Delete my account permanently"}
            </button>
            {deleteError && (
              <p className="text-sm text-destructive">{deleteError}</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
