/**
 * Static mockup of the OpenMic chat interface. Rendered as pure HTML so
 * it looks alive without pulling in the real chat component. Used in the
 * landing hero to show "this is what practice actually looks like."
 */
export function ChatMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* soft warm glow behind */}
      <div
        className="absolute -inset-6 rounded-2xl -z-10 blur-2xl opacity-40"
        style={{ background: "radial-gradient(closest-side, rgba(126,66,50,0.35), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative rounded-xl bg-card border border-border/70 shadow-[0_1px_2px_rgba(43,40,35,0.06),0_20px_60px_-20px_rgba(43,40,35,0.28)] overflow-hidden">
        {/* Chat header */}
        <div className="border-b border-border/60 px-5 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-0.5">
              Session
            </p>
            <p className="font-serif text-sm tracking-tight text-foreground">
              Behavioral job interview
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs tabular-nums text-foreground">
              12:43
            </p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              remaining
            </p>
          </div>
        </div>

        {/* Messages — transcript style per DESIGN.md */}
        <div className="p-5 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
              Interviewer
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              Tell me about a time you had to disagree with a manager. What
              did you say, and how did they respond?
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
              You
            </p>
            <div className="rounded-md bg-background p-3 border border-border/50">
              <p className="text-sm leading-relaxed text-foreground">
                We were about to ship a feature that I felt wasn&rsquo;t
                ready. I asked for fifteen minutes to walk through my
                specific concerns&hellip;
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
              Interviewer
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              What were those specific concerns? Walk me through
              <span className="inline-block ml-0.5 w-0.5 h-4 bg-foreground/50 align-middle animate-pulse" />
            </p>
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border/60 px-5 py-3 flex items-center gap-3">
          <div className="flex-1 rounded-md bg-background/60 border border-border/40 px-3 py-2">
            <p className="text-sm text-muted-foreground/70">
              Type your response&hellip;
            </p>
          </div>
          <div
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-primary text-primary-foreground shrink-0"
            aria-hidden
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13" />
              <path d="m22 2-7 20-4-9-9-4 20-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
