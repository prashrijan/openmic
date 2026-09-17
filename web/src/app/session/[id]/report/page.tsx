import { notFound } from "next/navigation";
import { getSessionBundle } from "@/lib/sessions/access";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Slice 2 placeholder. Slice 3 will:
 *   - Trigger feedback report generation (Claude Sonnet) at session end
 *   - Load feedback_reports row from Supabase
 *   - Render strengths / growth areas / suggestions in the DESIGN.md
 *     feedback-report treatment (Fraunces body, 64ch measure)
 *   - Add 👍/👎 rating action
 */
export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  const bundle = await getSessionBundle(id);
  if (!bundle) notFound();

  const durationMs = bundle.session.ended_at
    ? new Date(bundle.session.ended_at).getTime() -
      new Date(bundle.session.started_at).getTime()
    : 0;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);

  const scenarioTitle = bundle.scenario
    ? bundle.scenario.title
    : "Custom topic";

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-8 md:pt-20">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
          Session complete
        </p>
        <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-foreground">
          {scenarioTitle}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {bundle.messages.length} messages · {minutes}m {seconds}s ·{" "}
          {bundle.session.feedback_mode === "natural"
            ? "Natural flow"
            : "Coach mode"}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-4">
        <div className="rounded-lg bg-card p-8 border border-border">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
            Feedback report
          </p>
          <h2 className="font-serif text-2xl tracking-tight mb-3">
            Coming in Slice 3
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The next slice generates a warm, specific end-of-session feedback
            report using Claude Sonnet — strengths, growth areas, and 1&ndash;3
            concrete suggestions for next time. For now, the session has been
            marked ended in the database and the transcript is preserved.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-8">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
          Transcript
        </p>
        <div className="space-y-5">
          {bundle.messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No messages were exchanged in this session.
            </p>
          ) : (
            bundle.messages.map((m) => (
              <div key={m.id}>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-1.5">
                  {m.sender === "user"
                    ? "You"
                    : bundle.scenario?.suggested_ai_role ??
                      bundle.session.ai_role}
                </p>
                <div
                  className={
                    m.sender === "user"
                      ? "rounded-md bg-card p-4"
                      : "py-1"
                  }
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">
                    {m.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10 flex gap-3">
        <a
          href="/start"
          className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:brightness-95 transition"
        >
          Practice another
        </a>
        <a
          href="/"
          className="rounded-md bg-card px-5 py-3 text-sm font-medium hover:bg-muted transition"
        >
          Home
        </a>
      </section>
    </main>
  );
}
