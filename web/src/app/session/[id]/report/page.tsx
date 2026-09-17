import { notFound } from "next/navigation";
import { getSessionBundle } from "@/lib/sessions/access";
import { loadFeedbackReport } from "@/lib/sessions/report-access";
import { FeedbackRating } from "./FeedbackRating";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  const bundle = await getSessionBundle(id);
  if (!bundle) notFound();

  const report = await loadFeedbackReport(bundle);

  const durationMs = bundle.session.ended_at
    ? new Date(bundle.session.ended_at).getTime() -
      new Date(bundle.session.started_at).getTime()
    : 0;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);

  const scenarioTitle = bundle.scenario
    ? bundle.scenario.title
    : "Custom topic";

  const aiRole = bundle.scenario?.suggested_ai_role ?? bundle.session.ai_role;

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-6 md:pt-20">
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

      {/* Feedback report — the reading register (Fraunces, 64ch measure) */}
      <section className="mx-auto max-w-3xl px-6 py-6">
        {report ? (
          <article className="rounded-lg bg-card p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
              Your practice today
            </p>

            <ReportBlock
              label="Strengths"
              items={report.strengths}
              labelColor="text-[color:var(--color-success)]"
            />
            <ReportBlock
              label="Where to grow"
              items={report.growth_areas}
              className="mt-8"
            />
            <ReportBlock
              label="Try next time"
              items={report.suggestions}
              className="mt-8"
            />

            <FeedbackRating
              reportId={report.id}
              initialRating={report.rating}
            />
          </article>
        ) : (
          <div className="rounded-lg bg-card p-8 border border-border">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
              Feedback report unavailable
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The report couldn&rsquo;t be generated. Your session and
              transcript were saved, and you can retry from the transcript
              below on your next session.
            </p>
          </div>
        )}
      </section>

      {/* Transcript */}
      <section className="mx-auto max-w-3xl px-6 py-8 border-t border-border">
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
                  {m.sender === "user" ? "You" : aiRole}
                </p>
                <div
                  className={
                    m.sender === "user" ? "rounded-md bg-card p-4" : "py-1"
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

interface BlockProps {
  label: string;
  items: string[];
  labelColor?: string;
  className?: string;
}

function ReportBlock({ label, items, labelColor, className }: BlockProps) {
  return (
    <div className={className}>
      <p
        className={`text-xs uppercase tracking-[0.12em] mb-3 ${labelColor ?? "text-muted-foreground"}`}
      >
        {label}
      </p>
      <ul className="space-y-3 font-serif text-[18px] leading-[1.6] max-w-[64ch] text-foreground">
        {items.map((item, i) => (
          <li key={i} className="pl-4 -indent-4">
            <span className="mr-2 text-muted-foreground select-none">
              &middot;
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
