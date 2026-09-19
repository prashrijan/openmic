import Image from "next/image";
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
      {/* Editorial hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-16 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-5 inline-flex items-center gap-3">
              <span className="w-8 h-px bg-primary" />
              Signed in as {user.email}
            </p>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.02] tracking-tight text-foreground">
              Your practice
              <br />
              <em className="not-italic" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                history.
              </em>
            </h1>
            <p className="mt-5 text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl">
              {sessions.length === 0
                ? "Nothing here yet — your first session will show up after you complete one."
                : `Last ${sessions.length} session${sessions.length === 1 ? "" : "s"}, most recent first.`}
            </p>
          </div>
          <div className="md:col-span-5 hidden md:block">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-card">
              <Image
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=85&auto=format&fit=crop"
                alt="A quiet corner — the record of practice"
                fill
                sizes="40vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none mix-blend-multiply"
                style={{ background: "rgba(240, 237, 231, 0.12)" }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>

      {error && (
        <section className="mx-auto max-w-6xl px-6 py-6">
          <div className="rounded-lg bg-card p-4 text-sm text-destructive">
            Couldn&rsquo;t load history: {error.message}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        {sessions.length === 0 && !error ? (
          <div className="rounded-lg bg-card/60 p-12 text-center max-w-2xl mx-auto">
            <FileText
              className="w-8 h-8 text-primary/70 mx-auto mb-4"
              strokeWidth={1.3}
            />
            <p className="font-serif text-2xl tracking-tight mb-2">
              Your practice history will live here.
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Every completed session is saved with its feedback report. Look
              back anytime to see what you&rsquo;ve been working on.
            </p>
            <Link
              href="/start"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:brightness-95 transition"
            >
              Start your first session
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        ) : (
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
                    className="block py-6 hover:bg-card/40 -mx-4 md:-mx-6 px-4 md:px-6 rounded-md transition"
                  >
                    <div className="grid md:grid-cols-12 gap-4 md:gap-6 items-start">
                      <div className="md:col-span-8 min-w-0">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                          {category && (
                            <CategoryIcon
                              category={category}
                              className="w-3 h-3"
                            />
                          )}
                          <p className="text-[11px] uppercase tracking-[0.14em]">
                            {category ? CATEGORY_LABELS[category] : "Custom topic"}
                            {isActive && (
                              <span className="ml-2 text-primary">
                                · In progress
                              </span>
                            )}
                          </p>
                        </div>
                        <h2 className="font-serif text-2xl tracking-tight truncate mb-2">
                          {title}
                        </h2>
                        {preview && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex items-start gap-2">
                            <Sparkles
                              className="w-3.5 h-3.5 mt-1 shrink-0 text-[color:var(--color-success)]"
                              strokeWidth={1.5}
                            />
                            <span>{preview}</span>
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-4 md:text-right text-sm text-muted-foreground">
                        <p className="font-serif text-lg text-foreground">
                          {formatDate(s.started_at)}
                        </p>
                        {minutes !== null && (
                          <p className="mt-1 text-xs tabular-nums uppercase tracking-[0.14em]">
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
