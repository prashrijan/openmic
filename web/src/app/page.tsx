import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Coffee, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero — split layout with warm-interior photograph */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-20 grid md:grid-cols-5 gap-10 md:gap-14 items-center">
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-5">
              In development · v0.1
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-foreground">
              Practice a conversation
              <br />
              before it happens.
            </h1>
            <p className="mt-7 text-lg md:text-xl leading-relaxed text-foreground max-w-xl">
              OpenMic is a quiet room for practicing English out loud &mdash;
              interviews, meetings, small talk, and everything in between.
              Talk with an AI partner that stays in character, then read a
              short feedback report when you&rsquo;re done.
            </p>
            <div className="mt-9 flex items-center gap-5 flex-wrap">
              <Link
                href="/start"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:brightness-95 transition"
              >
                Try a session &mdash; no signup
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="text-sm text-muted-foreground">
                2 free sessions before signup
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-card">
              <Image
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80&auto=format&fit=crop"
                alt="Warm morning light on a coffee cup — the quiet room feel"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                priority
              />
              {/* Warm tone overlay to blend with Falu Room */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-multiply"
                style={{ background: "rgba(240, 237, 231, 0.15)" }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
            How it works
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight max-w-2xl">
            Three small steps, and you&rsquo;re practicing.
          </h2>

          <ol className="mt-12 grid md:grid-cols-3 gap-8 md:gap-10">
            <Step
              n="01"
              title="Pick a scenario"
              body="Choose from job interviews, meetings, small talk, or write your own topic. Roleplay setup takes seconds."
            />
            <Step
              n="02"
              title="Talk it through"
              body="Chat with an AI partner in character. They push back, ask follow-ups, and stay in role for the whole 15-minute session."
            />
            <Step
              n="03"
              title="Read your feedback"
              body="A short report highlights what you did well, where to grow, and one or two things to try next time."
            />
          </ol>
        </div>
      </section>

      {/* Sample scenarios */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
            A few things to try
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight max-w-2xl mb-10">
            What do you want to practice?
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <SamplePreview
              Icon={Briefcase}
              category="Interviews"
              title="Behavioral job interview"
              body="Practice telling clear, specific stories in the STAR format."
            />
            <SamplePreview
              Icon={Users}
              category="Meetings & work"
              title="Present to a skeptical stakeholder"
              body="Defend your reasoning without getting defensive."
            />
            <SamplePreview
              Icon={Coffee}
              category="Small talk"
              title="Coffee-shop small talk"
              body="Be open, curious, and easy to talk to."
            />
          </div>

          <div className="mt-10">
            <Link
              href="/start"
              className="inline-flex items-center gap-2 text-sm text-foreground underline underline-offset-4 hover:text-primary transition"
            >
              See all 12 scenarios
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Second image break — a moment of quiet */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
              Why OpenMic
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight mb-6">
              Reps, not lessons.
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-foreground max-w-lg">
              <p>
                Communication anxiety doesn&rsquo;t go away through study.
                It goes away through reps &mdash; small, low-stakes
                conversations where the cost of a fumble is nothing.
              </p>
              <p>
                Every OpenMic session is 15 minutes with a partner who stays
                in character, and afterwards, a short, honest report that
                names what worked and what to try next.
              </p>
              <p className="text-muted-foreground">
                No streaks, no scores, no drills. Just practice.
              </p>
            </div>
          </div>

          <div className="relative aspect-[5/4] rounded-lg overflow-hidden bg-card md:order-first">
            <Image
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80&auto=format&fit=crop"
              alt="A quiet reading corner — books, warm light, unhurried"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply"
              style={{ background: "rgba(240, 237, 231, 0.12)" }}
              aria-hidden
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            OpenMic is built in public. Photography from Unsplash.
          </p>
          <nav className="flex items-center gap-6 text-sm">
            <a
              href="https://github.com/prashrijan/openmic"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://github.com/prashrijan/openmic/blob/main/docs/01-scope.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              Scope
            </a>
            <a
              href="https://github.com/prashrijan/openmic/blob/main/design/DESIGN.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              Design system
            </a>
          </nav>
        </div>
      </section>
    </main>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <li className="relative pl-1">
      <p className="font-serif text-3xl text-primary/70 mb-3 tabular-nums leading-none">
        {n}
      </p>
      <h3 className="font-serif text-xl tracking-tight mb-2">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </li>
  );
}

function SamplePreview({
  Icon,
  category,
  title,
  body,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  category: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg bg-card p-6 border border-border/60">
      <Icon
        className="w-5 h-5 text-primary/80 mb-4"
        strokeWidth={1.5}
      />
      <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">
        {category}
      </p>
      <h3 className="font-serif text-lg tracking-tight mb-2 leading-snug">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
