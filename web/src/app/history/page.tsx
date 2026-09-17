import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Slice 5 will render:
 *   - Last 30 sessions per FR-5.2
 *   - Date, scenario/topic, duration, feedback preview
 *   - Click through to /session/[id]/report
 *
 * For now: gate the page behind auth and show a friendly placeholder.
 */
export default async function HistoryPage() {
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/login?next=%2Fhistory");

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-8 md:pt-24">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
          Signed in as {user.email}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight">
          Your practice history
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Coming in the next slice — a running list of your last 30
          sessions with their feedback reports.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <a
          href="/start"
          className="inline-flex rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:brightness-95 transition"
        >
          Start a new session
        </a>
      </section>
    </main>
  );
}
