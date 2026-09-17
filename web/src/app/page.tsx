export default function Home() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-16 md:pt-32">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-6">
          In development · v0.1
        </p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight text-foreground">
          Practice a conversation<br />before it happens.
        </h1>
        <p className="mt-8 text-lg md:text-xl leading-relaxed text-foreground max-w-2xl">
          OpenMic is a quiet room for practicing English out loud — interviews,
          meetings, small talk, and everything in between. Talk with an AI
          partner that stays in character, then read a short feedback report
          when you&rsquo;re done.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <a
            href="/start"
            className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-95"
          >
            Try a session &mdash; no signup
          </a>
          <p className="text-sm text-muted-foreground">
            2 free sessions before signup
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 border-t border-border">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
          What&rsquo;s here so far
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <a
            href="https://github.com/prashrijan/openmic/blob/main/docs/01-scope.md"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-card p-6 hover:bg-muted transition"
          >
            <h3 className="font-serif text-xl tracking-tight mb-2">
              Scope &amp; requirements
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              What v0.1 ships and what it deliberately doesn&rsquo;t. The
              problem, the users, the phased release plan.
            </p>
          </a>
          <a
            href="https://github.com/prashrijan/openmic/blob/main/design/DESIGN.md"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-card p-6 hover:bg-muted transition"
          >
            <h3 className="font-serif text-xl tracking-tight mb-2">
              Falu Room design system
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nordic Calm with an editorial-serif accent. Palette anchored to{" "}
              <em>falu rödfärg</em>, the rust-red pigment used on Swedish
              country houses since the 17th century.
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}
