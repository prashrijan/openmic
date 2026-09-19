import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Minus, Quote } from "lucide-react";
import { ChatMockup } from "@/components/ChatMockup";

export default function Home() {
  return (
    <main className="flex-1">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Warm subtle background */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(1000px 500px at 70% 20%, rgba(126,66,50,0.06), transparent 60%), radial-gradient(700px 400px at 20% 80%, rgba(78,95,53,0.05), transparent 60%)",
          }}
          aria-hidden
        />

        <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6 inline-flex items-center gap-3">
              <span className="w-8 h-px bg-primary" />
              Communication practice, without a coach
            </p>
            <h1 className="font-serif text-[clamp(3rem,7.5vw,6.75rem)] leading-[0.98] tracking-[-0.02em] text-foreground">
              Practice
              <br />
              <em
                className="not-italic"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                the conversation
              </em>
              <br />
              before it happens.
            </h1>
            <p className="mt-8 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl">
              An AI partner that stays in character for a full session, then
              writes you a short, honest report when you&rsquo;re done. Built
              for job interviews, meetings, small talk, and every conversation
              you&rsquo;ve rehearsed in the shower.
            </p>
            <div className="mt-10 flex items-center gap-6 flex-wrap">
              <Link
                href="/start"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:brightness-95 transition"
              >
                Try a session &mdash; no signup
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm text-foreground underline underline-offset-4 hover:text-primary transition"
              >
                See how it works
              </Link>
            </div>

            {/* Trust bar */}
            <dl className="mt-14 grid grid-cols-3 gap-8 max-w-md">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1">
                  Scenarios
                </dt>
                <dd className="font-serif text-3xl tracking-tight tabular-nums text-foreground">
                  12
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1">
                  Session
                </dt>
                <dd className="font-serif text-3xl tracking-tight tabular-nums text-foreground">
                  15<span className="text-lg text-muted-foreground ml-0.5">min</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1">
                  Signup
                </dt>
                <dd className="font-serif text-3xl tracking-tight text-foreground">
                  None
                </dd>
              </div>
            </dl>
          </div>

          {/* Right — product mockup */}
          <div className="lg:col-span-5 lg:pl-6">
            <ChatMockup />
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
                How it works
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.01em]">
                Three small
                <br />
                <em
                  className="not-italic"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                >
                  steps.
                </em>
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7 flex items-end">
              <p className="text-lg leading-relaxed text-muted-foreground max-w-xl">
                No signup on your first session. No permanent record until you
                say so. Just start.
              </p>
            </div>
          </div>

          <ol className="grid md:grid-cols-3 gap-12 md:gap-16 border-t border-border pt-12">
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

      {/* ============ COMPARISON ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
                What&rsquo;s different
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.01em]">
                Not a course.
                <br />
                <em
                  className="not-italic"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                >
                  A partner.
                </em>
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8 flex items-end">
              <p className="text-lg leading-relaxed text-muted-foreground max-w-lg">
                Communication anxiety doesn&rsquo;t go away through drills.
                It goes away through reps in a low-stakes room.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 pr-4 text-xs uppercase tracking-[0.14em] text-muted-foreground font-normal align-bottom w-1/4">
                    &nbsp;
                  </th>
                  <th className="py-4 px-4 align-bottom">
                    <p className="text-xs uppercase tracking-[0.14em] text-primary mb-1">
                      Us
                    </p>
                    <p className="font-serif text-xl tracking-tight">OpenMic</p>
                  </th>
                  <th className="py-4 px-4 align-bottom">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1">
                      Alternative
                    </p>
                    <p className="font-serif text-xl tracking-tight text-muted-foreground">
                      ChatGPT
                    </p>
                  </th>
                  <th className="py-4 px-4 align-bottom">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1">
                      Alternative
                    </p>
                    <p className="font-serif text-xl tracking-tight text-muted-foreground">
                      Language apps
                    </p>
                  </th>
                  <th className="py-4 pl-4 align-bottom">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1">
                      Alternative
                    </p>
                    <p className="font-serif text-xl tracking-tight text-muted-foreground">
                      Human tutor
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <CompareRow
                  feature="Roleplay in character"
                  cells={[true, "sometimes", false, true]}
                />
                <CompareRow
                  feature="Structured feedback report"
                  cells={[true, false, false, true]}
                />
                <CompareRow
                  feature="No scheduling required"
                  cells={[true, true, true, false]}
                />
                <CompareRow
                  feature="Free to start"
                  cells={[true, "limited", true, false]}
                />
                <CompareRow
                  feature="Built for anxiety, not fluency"
                  cells={[true, false, false, "sometimes"]}
                />
                <CompareRow
                  feature="Zero judgment"
                  cells={[true, true, true, "depends"]}
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-3xl mb-16">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
              The premise
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.01em]">
              People who freeze up in meetings aren&rsquo;t looking for
              <em
                className="not-italic"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                {" "}
                lessons.
              </em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Testimonial
              quote="I did the coffee-shop small talk scenario six times before my sister's wedding. Nobody knew I'd been practicing."
              name="Priya M."
              role="Product manager"
            />
            <Testimonial
              quote="It's the only place I can practice a tough conversation and know for sure the other person won't remember it tomorrow."
              name="Kenji A."
              role="Software engineer"
            />
            <Testimonial
              quote="Interview coaches cost $200 an hour. This costs nothing and doesn't judge me when I fumble the opening."
              name="Ana R."
              role="Recent graduate"
            />
          </div>
          <p className="mt-6 text-xs text-muted-foreground text-center">
            Testimonials are illustrative &mdash; OpenMic is in development.
          </p>
        </div>
      </section>

      {/* ============ WHY OPENMIC ============ */}
      <section id="why" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          <div className="md:col-span-6 relative aspect-[4/5] rounded-lg overflow-hidden bg-card order-2 md:order-1">
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

          <div className="md:col-span-6 order-1 md:order-2">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
              Why OpenMic
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.01em] mb-8">
              Reps, not
              <em
                className="not-italic block"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                lessons.
              </em>
            </h2>
            <div className="space-y-5 text-base md:text-lg leading-relaxed text-foreground max-w-lg">
              <p>
                <span className="font-serif text-5xl float-left mr-3 leading-[0.85] -mt-1 text-primary/70">
                  M
                </span>
                ost communication anxiety isn&rsquo;t about grammar or
                vocabulary. It&rsquo;s about wanting to be understood, and
                being afraid you won&rsquo;t be.
              </p>
              <p>
                OpenMic gives you a place to practice that doesn&rsquo;t judge
                and doesn&rsquo;t remember what you fumbled last time. Every
                session is fifteen minutes with a partner who stays in
                character. Then a short report you can read on the way to the
                real thing.
              </p>
              <p className="text-muted-foreground">
                No streaks. No scores. No lessons. Just practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ QUOTE ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
          <Quote
            className="w-8 h-8 mx-auto mb-8 text-primary/60"
            strokeWidth={1.2}
          />
          <p className="font-serif text-3xl md:text-5xl leading-[1.15] tracking-tight text-foreground">
            <em className="not-italic">
              You don&rsquo;t rise to the level of the interview.
              <br />
              You fall to the level of your practice.
            </em>
          </p>
          <div className="mt-10 inline-block">
            <div className="h-px w-16 bg-border mx-auto mb-3" />
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              With apologies to Archilochus
            </p>
          </div>
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/70 mb-6">
            Ready when you are
          </p>
          <h2 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-[-0.01em] mb-12">
            The conversation
            <br />
            <em
              className="not-italic"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
            >
              is waiting.
            </em>
          </h2>
          <Link
            href="/start"
            className="group inline-flex items-center gap-2 rounded-md bg-primary-foreground text-primary px-7 py-4 text-base font-medium hover:brightness-95 transition"
          >
            Start a session
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <p className="font-serif text-2xl tracking-tight mb-3 inline-flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              OpenMic
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              A quiet room for practicing English out loud. Built in public,
              free forever for the first sessions.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-4">
              Product
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/start" className="hover:text-primary transition">
                  Scenarios
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-4">
              Docs
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
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-muted-foreground flex flex-wrap justify-between gap-3">
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
      <p className="font-serif text-6xl text-primary/70 mb-5 tabular-nums leading-none">
        {n}
      </p>
      <h3 className="font-serif text-2xl md:text-3xl tracking-tight mb-3">
        {title}
      </h3>
      <p className="text-base leading-relaxed text-muted-foreground">{body}</p>
    </li>
  );
}

function CompareRow({
  feature,
  cells,
}: {
  feature: string;
  cells: (boolean | string)[];
}) {
  return (
    <tr className="border-b border-border/60 last:border-b-0">
      <td className="py-4 pr-4 font-medium text-foreground">{feature}</td>
      {cells.map((c, i) => (
        <td
          key={i}
          className={`py-4 ${i === 0 ? "px-4 bg-card/40" : i === cells.length - 1 ? "pl-4" : "px-4"}`}
        >
          <CompareCell value={c} highlight={i === 0} />
        </td>
      ))}
    </tr>
  );
}

function CompareCell({
  value,
  highlight,
}: {
  value: boolean | string;
  highlight?: boolean;
}) {
  if (value === true) {
    return (
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
          highlight ? "bg-primary text-primary-foreground" : "bg-card"
        }`}
      >
        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-transparent text-muted-foreground/40">
        <Minus className="w-3.5 h-3.5" strokeWidth={2} />
      </span>
    );
  }
  return (
    <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
      {value}
    </span>
  );
}

function Testimonial({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  const initial = name[0];
  return (
    <figure className="rounded-lg bg-background p-8 flex flex-col h-full">
      <Quote className="w-5 h-5 text-primary/50 mb-5" strokeWidth={1.5} />
      <blockquote className="font-serif text-xl md:text-2xl leading-[1.35] tracking-tight text-foreground flex-1">
        {quote}
      </blockquote>
      <figcaption className="mt-6 pt-6 border-t border-border/60 flex items-center gap-3">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-serif text-sm">
          {initial}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
