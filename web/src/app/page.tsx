import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1">
      {/* ============ FULL-BLEED HERO ============ */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=2400&q=85&auto=format&fit=crop"
          alt="Warm morning light on a coffee cup"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Warm scrim — bottom-heavy gradient for headline legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(240,237,231,0.10) 0%, rgba(240,237,231,0.30) 45%, rgba(240,237,231,0.92) 100%)",
          }}
          aria-hidden
        />

        {/* Hero content */}
        <div className="relative h-full mx-auto max-w-6xl px-6 flex flex-col justify-end pb-16 md:pb-20">
          <p className="text-xs uppercase tracking-[0.16em] text-foreground/70 mb-5 inline-flex items-center gap-3">
            <span className="w-8 h-px bg-primary" />
            In development · v0.1
          </p>
          <h1 className="font-serif text-[clamp(3rem,8vw,7.5rem)] leading-[0.98] tracking-tight text-foreground max-w-5xl">
            Practice
            <br />
            <em className="not-italic" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
              a conversation
            </em>
            <br />
            before it happens.
          </h1>
          <div className="mt-8 md:mt-10 flex items-center gap-6 flex-wrap">
            <Link
              href="/start"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:brightness-95 transition"
            >
              Try a session &mdash; no signup
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="text-sm text-foreground/70">
              2 free sessions before signup
            </p>
          </div>
        </div>
      </section>

      {/* ============ TAG LINE + INTRO ============ */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              What is this
            </p>
          </div>
          <div className="md:col-span-8">
            <p className="font-serif text-2xl md:text-3xl leading-[1.35] text-foreground max-w-3xl">
              A quiet room for practicing English out loud &mdash; interviews,
              meetings, small talk, and everything in between. Talk with an AI
              partner that stays in character, then read a short, honest report
              when you&rsquo;re done.
            </p>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-12 gap-8 mb-14">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
                How it works
              </p>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
                Three small
                <br />
                steps.
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6 flex items-end">
              <p className="text-base leading-relaxed text-muted-foreground max-w-xl">
                No signup on your first session. No permanent record until you
                say so. Just start.
              </p>
            </div>
          </div>

          <ol className="grid md:grid-cols-3 gap-10 md:gap-14 border-t border-border pt-10">
            <Step
              n="01"
              title="Pick a scenario"
              body="Choose from job interviews, meetings, small talk, ESL fluency, or difficult conversations. Or write your own topic in a sentence."
            />
            <Step
              n="02"
              title="Talk it through"
              body="Chat with an AI partner in character. They push back, ask follow-ups, and stay in role for the whole 15-minute session."
            />
            <Step
              n="03"
              title="Read your feedback"
              body="A short report names what you did well, where to grow, and one or two concrete things to try next time. No scores. No drills."
            />
          </ol>
        </div>
      </section>

      {/* ============ FEATURED QUOTE ============ */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-32 text-center">
          <Quote
            className="w-6 h-6 mx-auto mb-8 text-primary/60"
            strokeWidth={1.5}
          />
          <p className="font-serif text-3xl md:text-5xl leading-[1.15] tracking-tight text-foreground">
            <em className="not-italic">
              Communication anxiety doesn&rsquo;t go away through study.
              It goes away through reps.
            </em>
          </p>
          <div className="mt-10 inline-block">
            <div className="h-px w-16 bg-border mx-auto mb-3" />
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              The premise of OpenMic
            </p>
          </div>
        </div>
      </section>

      {/* ============ WHAT YOU CAN PRACTICE ============ */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-6">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
                What you can practice
              </p>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
                Twelve scenarios,
                <br />
                five registers.
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8 flex items-end">
              <p className="text-base leading-relaxed text-muted-foreground max-w-lg">
                Curated starter scenarios across the situations most people
                struggle with. Or write your own.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ScenarioCard
              image="https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80&auto=format&fit=crop"
              alt="A hand writing in a notebook"
              category="Interviews"
              title="Behavioral job interview"
              body="Practice STAR-format storytelling with a professional interviewer."
            />
            <ScenarioCard
              image="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80&auto=format&fit=crop"
              alt="A quiet meeting space"
              category="Meetings &amp; work"
              title="Present to a skeptical stakeholder"
              body="Defend your reasoning without getting defensive."
            />
            <ScenarioCard
              image="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&q=80&auto=format&fit=crop"
              alt="Coffee cups on a table"
              category="Small talk"
              title="Coffee-shop small talk"
              body="Be open, curious, and easy to talk to."
            />
            <ScenarioCard
              image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80&auto=format&fit=crop"
              alt="A stack of books"
              category="ESL fluency"
              title="Tell a story about a memorable moment"
              body="Beginning, middle, end &mdash; drawn out by an attentive listener."
            />
            <ScenarioCard
              image="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80&auto=format&fit=crop"
              alt="A quiet reading corner"
              category="Difficult conversations"
              title="Setting a boundary with family"
              body="Be clear and firm without being harsh."
            />
            <div className="rounded-lg bg-background p-6 flex flex-col justify-center min-h-[300px]">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-4">
                Plus 7 more
              </p>
              <p className="font-serif text-2xl leading-tight tracking-tight mb-4">
                Salary negotiations, 1:1s, networking, and more.
              </p>
              <Link
                href="/start"
                className="inline-flex items-center gap-1.5 text-sm text-primary underline underline-offset-4 hover:brightness-90 transition"
              >
                See all 12 scenarios
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY OPENMIC ============ */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          <div className="md:col-span-6 relative aspect-[4/5] rounded-lg overflow-hidden bg-card">
            <Image
              src="https://images.unsplash.com/photo-1509909756405-be0199881695?w=1200&q=85&auto=format&fit=crop"
              alt="Afternoon light on hands, a moment of quiet focus"
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

          <div className="md:col-span-6">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-4">
              Why OpenMic
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight mb-8">
              Reps, not lessons.
            </h2>
            <div className="space-y-5 text-base md:text-lg leading-relaxed text-foreground max-w-lg">
              <p>
                <span className="font-serif text-4xl float-left mr-2 leading-none -mt-1 text-primary/70">
                  M
                </span>
                ost communication anxiety isn&rsquo;t about grammar or
                vocabulary. It&rsquo;s about wanting to be understood, and
                being afraid you won&rsquo;t be.
              </p>
              <p>
                OpenMic gives you a place to practice that doesn&rsquo;t
                judge and doesn&rsquo;t remember what you fumbled last time.
                Every session is 15 minutes with a partner who stays in
                character.
              </p>
              <p className="text-muted-foreground">
                No streaks. No scores. No lessons. Just practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-28 text-center">
          <p className="text-xs uppercase tracking-[0.16em] text-primary-foreground/70 mb-6">
            Ready when you are
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight mb-10">
            The conversation
            <br />
            is waiting.
          </h2>
          <Link
            href="/start"
            className="group inline-flex items-center gap-2 rounded-md bg-primary-foreground text-primary px-6 py-3.5 text-sm font-medium hover:brightness-95 transition"
          >
            Start a session
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <p className="font-serif text-xl tracking-tight mb-2 inline-flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              OpenMic
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A quiet room for practicing English out loud. Built in public.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-4">
              Docs
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/prashrijan/openmic/blob/main/docs/01-scope.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition"
                >
                  Scope
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/prashrijan/openmic/blob/main/docs/03-architecture.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition"
                >
                  Architecture
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/prashrijan/openmic/blob/main/design/DESIGN.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition"
                >
                  Design system
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-4">
              Elsewhere
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/prashrijan/openmic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground flex flex-wrap justify-between gap-3">
            <p>© 2026 Prashrijan Shrestha. MIT licensed.</p>
            <p>Photography from Unsplash.</p>
          </div>
        </div>
      </footer>
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
    <li>
      <p className="font-serif text-5xl text-primary/70 mb-4 tabular-nums leading-none">
        {n}
      </p>
      <h3 className="font-serif text-2xl tracking-tight mb-3">{title}</h3>
      <p className="text-base leading-relaxed text-muted-foreground">{body}</p>
    </li>
  );
}

function ScenarioCard({
  image,
  alt,
  category,
  title,
  body,
}: {
  image: string;
  alt: string;
  category: string;
  title: string;
  body: string;
}) {
  return (
    <div className="group rounded-lg bg-background overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{ background: "rgba(240, 237, 231, 0.15)" }}
          aria-hidden
        />
      </div>
      <div className="p-6">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-2">
          {category}
        </p>
        <h3 className="font-serif text-xl tracking-tight mb-2 leading-snug">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
