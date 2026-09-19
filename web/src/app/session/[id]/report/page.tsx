import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";
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

  const scenarioTitle = bundle.scenario ? bundle.scenario.title : "Custom topic";
  const aiRole = bundle.scenario?.suggested_ai_role ?? bundle.session.ai_role;

  return (
    <main className="flex-1">
      {/* ============ EDITORIAL HERO ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 pt-16 pb-12 md:pt-20 md:pb-16">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-5 inline-flex items-center gap-3">
            <span className="w-8 h-px bg-primary" />
            Session complete
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.01em]">
            Your practice
            <br />
            <em
              className="not-italic"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
            >
              today.
            </em>
          </h1>
          <p className="mt-5 text-lg text-foreground/80 max-w-2xl leading-relaxed">
            {scenarioTitle}, with {aiRole}.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            <span className="tabular-nums">
              {minutes}m {seconds}s
            </span>
            <span className="text-border">·</span>
            <span>{bundle.messages.length} messages</span>
            <span className="text-border">·</span>
            <span>
              {bundle.session.feedback_mode === "natural"
                ? "Natural flow"
                : "Coach mode"}
            </span>
          </div>
        </div>
      </section>

      {/* ============ FEEDBACK REPORT ============ */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          {report ? (
            <article>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-5 inline-flex items-center gap-3">
                <span className="w-8 h-px bg-primary" />
                Feedback report
              </p>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.01em] mb-12 max-w-2xl">
                Here&rsquo;s how it went.
              </h2>

              <div className="space-y-14">
                <ReportBlock
                  Icon={Sparkles}
                  label="Strengths"
                  items={report.strengths}
                  labelColor="text-[color:var(--color-success)]"
                  iconColor="text-[color:var(--color-success)]"
                />
                <ReportBlock
                  Icon={TrendingUp}
                  label="Where to grow"
                  items={report.growth_areas}
                />
                <ReportBlock
                  Icon={Target}
                  label="Try next time"
                  items={report.suggestions}
                />
              </div>

              <FeedbackRating
                reportId={report.id}
                initialRating={report.rating}
              />
            </article>
          ) : (
            <div className="rounded-lg bg-card p-10 border border-border max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Feedback report unavailable
              </p>
              <p className="font-serif text-2xl tracking-tight mb-3">
                The report couldn&rsquo;t be generated.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your session and transcript were saved. You can start a fresh
                session and try again below.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============ TRANSCRIPT ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <div className="flex items-baseline justify-between gap-4 mb-8 pb-4 border-b border-border">
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
              Transcript
            </h2>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {bundle.messages.length} messages
            </p>
          </div>

          {bundle.messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No messages were exchanged in this session.
            </p>
          ) : (
            <div className="space-y-8 max-w-3xl">
              {bundle.messages.map((m) => (
                <div key={m.id}>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-2 inline-flex items-center gap-2">
                    <span
                      className={`inline-block w-1 h-1 rounded-full ${
                        m.sender === "user"
                          ? "bg-primary"
                          : "bg-muted-foreground/60"
                      }`}
                    />
                    {m.sender === "user" ? "You" : aiRole}
                  </p>
                  <div
                    className={
                      m.sender === "user"
                        ? "rounded-lg bg-card p-4"
                        : "pl-1"
                    }
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-base text-foreground">
                      {m.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ NEXT ACTIONS ============ */}
      <section>
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20 flex flex-wrap gap-4">
          <Link
            href="/start"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:brightness-95 transition"
          >
            Practice another
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 rounded-md bg-card px-6 py-3.5 text-sm font-medium hover:bg-muted transition"
          >
            See your history
          </Link>
        </div>
      </section>
    </main>
  );
}

interface BlockProps {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  items: string[];
  labelColor?: string;
  iconColor?: string;
}

function ReportBlock({ Icon, label, items, labelColor, iconColor }: BlockProps) {
  return (
    <div>
      <p
        className={`text-[11px] uppercase tracking-[0.18em] mb-5 inline-flex items-center gap-2.5 ${labelColor ?? "text-muted-foreground"}`}
      >
        <Icon
          className={`w-3.5 h-3.5 ${iconColor ?? "text-muted-foreground"}`}
          strokeWidth={1.8}
        />
        {label}
      </p>
      <ol className="space-y-5 font-serif text-lg md:text-xl leading-[1.6] max-w-[64ch] text-foreground">
        {items.map((item, i) => (
          <li key={i} className="pl-6 -indent-6 flex gap-3">
            <span className="text-primary/60 tabular-nums text-base pt-1 shrink-0 min-w-[1.5rem]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
