/**
 * Session view — placeholder for Slice 1.
 *
 * Slice 2 will implement the full chat interface with:
 *   - Real-time SSE streaming from Claude Haiku
 *   - Message history from public.messages
 *   - The transcript-style layout per DESIGN.md §Components
 *   - End session button → feedback report generation
 */
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { headers } from "next/headers";
import { hashGuestCookieValue } from "@/lib/auth/guest-cookie";
import type { SessionRow, Scenario } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: Props) {
  const { id } = await params;

  // Try user-scoped read first (works for signed-in users via RLS)
  const userDb = await createSupabaseServerClient();
  const userRes = await userDb
    .from("sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  let session: SessionRow | null = (userRes.data as SessionRow | null) ?? null;

  // Fallback: guest access — verify the guest cookie owns this session
  if (!session) {
    const guestId = (await headers()).get("x-openmic-guest-id");
    if (!guestId) notFound();

    const hash = await hashGuestCookieValue(guestId);
    const serviceDb = createSupabaseServiceClient();
    const { data } = await serviceDb
      .from("sessions")
      .select("*")
      .eq("id", id)
      .eq("guest_cookie_hash", hash)
      .maybeSingle();
    session = (data as SessionRow | null) ?? null;
  }

  if (!session) notFound();

  // Load the scenario if one is linked (public read via RLS)
  let scenario: Scenario | null = null;
  if (session.scenario_id) {
    const { data } = await userDb
      .from("scenarios")
      .select("*")
      .eq("id", session.scenario_id)
      .maybeSingle();
    scenario = (data as Scenario | null) ?? null;
  }

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-8 md:pt-20">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
          Session in progress
        </p>
        <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-foreground">
          {scenario ? scenario.title : "Your custom topic"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Playing: <span className="text-foreground">{session.ai_role}</span> ·
          Difficulty:{" "}
          <span className="text-foreground capitalize">{session.difficulty}</span> ·
          Feedback:{" "}
          <span className="text-foreground capitalize">
            {session.feedback_mode === "natural"
              ? "Natural flow"
              : "Coach mode"}
          </span>
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-lg bg-card p-8 border border-border">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
            Coming next
          </p>
          <h2 className="font-serif text-2xl tracking-tight mb-3">
            Chat interface loads here
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Slice 2 wires up the streaming chat with Claude Haiku, the
            transcript-style message layout from DESIGN.md, and the end-session
            → feedback report flow. Session created successfully — the ID is{" "}
            <code className="text-xs bg-background rounded px-1.5 py-0.5">
              {session.id}
            </code>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
