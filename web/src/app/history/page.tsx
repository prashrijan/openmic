import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Difficulty, FeedbackMode, ScenarioCategory } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

interface SessionRow {
  id: string;
  custom_topic: string | null;
  difficulty: Difficulty;
  feedback_mode: FeedbackMode;
  started_at: string;
  ended_at: string | null;
  status: string;
  ai_role: string;
  scenarios: { title: string; category: ScenarioCategory } | null;
  feedback_reports: { strengths: string[]; suggestions: string[] } | null;
}

export default async function HistoryPage() {
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/login?next=%2Fhistory");

  const { data, error } = await db
    .from("sessions")
    .select(
      "id, custom_topic, difficulty, feedback_mode, started_at, ended_at, status, ai_role, scenarios(title, category), feedback_reports(strengths, suggestions)",
    )
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(30);

  const sessions = (data ?? []) as unknown as SessionRow[];

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-6 md:pt-20">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
          Signed in as {user.email}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight">
          Your practice history
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {sessions.length === 0
            ? "Nothing here yet — your first session will show up after you complete one."
            : `Last ${sessions.length} session${sessions.length === 1 ? "" : "s"}.`}
        </p>
      </section>

      {error && (
        <section className="mx-auto max-w-3xl px-6 py-4">
          <div className="rounded-lg bg-card p-4 text-sm text-destructive">
            Couldn&rsquo;t load history: {error.message}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-6 pb-6">
        <ul className="divide-y divide-border">
          {sessions.map((s) => {
            const durationMs = s.ended_at
              ? new Date(s.ended_at).getTime() -
                new Date(s.started_at).getTime()
              : null;
            const minutes = durationMs ? Math.floor(durationMs / 60000) : null;
            const seconds = durationMs
              ? Math.floor((durationMs % 60000) / 1000)
              : null;
            const title =
              s.scenarios?.title ??
              (s.custom_topic ? truncate(s.custom_topic, 80) : "Untitled session");
            const category = s.scenarios?.category;
            const preview = s.feedback_reports?.strengths?.[0] ?? null;
            const isActive = s.status === "active";

            return (
              <li key={s.id}>
                <Link
                  href={isActive ? `/session/${s.id}` : `/session/${s.id}/report`}
                  className="block py-5 hover:bg-card/60 -mx-2 px-2 rounded-md transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        {category && (
                          <CategoryIcon
                            category={category}
                            className="w-3 h-3"
                          />
                        )}
                        <p className="text-[11px] uppercase tracking-[0.12em]">
                          {category ? CATEGORY_LABELS[category] : "Custom topic"}
                          {isActive && (
                            <span className="ml-2 text-primary">· In progress</span>
                          )}
                        </p>
                      </div>
                      <h2 className="font-serif text-lg tracking-tight truncate">
                        {title}
                      </h2>
                      {preview && (
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2 flex items-start gap-2">
                          <Sparkles
                            className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[color:var(--color-success)]"
                            strokeWidth={1.5}
                          />
                          <span>{preview}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                      <p>{formatDate(s.started_at)}</p>
                      {minutes !== null && (
                        <p className="mt-1 tabular-nums">
                          {minutes}m {seconds}s
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {sessions.length === 0 && !error && (
          <div className="rounded-lg bg-card/50 border border-border/60 p-10 text-center">
            <FileText
              className="w-6 h-6 text-muted-foreground mx-auto mb-3"
              strokeWidth={1.5}
            />
            <p className="text-sm text-foreground mb-1">
              Your practice history will live here.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Every completed session is saved with its feedback report.
            </p>
            <Link
              href="/start"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:brightness-95 transition"
            >
              Start your first session
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : s.slice(0, n).trimEnd() + "…";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
