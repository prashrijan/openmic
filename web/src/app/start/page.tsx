import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Scenario } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/types";
import { StartClient } from "./StartClient";

export const dynamic = "force-dynamic";

export default async function StartPage() {
  const db = await createSupabaseServerClient();
  const { data, error } = await db
    .from("scenarios")
    .select(
      "id, slug, category, title, description, suggested_ai_role, suggested_difficulty, system_prompt_template, is_active, display_order",
    )
    .eq("is_active", true)
    .order("category")
    .order("display_order");

  const scenarios = (data ?? []) as Scenario[];

  const grouped = new Map<string, Scenario[]>();
  for (const cat of CATEGORY_ORDER) grouped.set(cat, []);
  for (const s of scenarios) grouped.get(s.category)?.push(s);

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-8 md:pt-24">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
          Step 1 of 2
        </p>
        <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] tracking-tight text-foreground">
          What do you want to practice?
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground max-w-2xl">
          Pick a scenario below, or describe your own. You&rsquo;ll be able to
          tweak the role, difficulty, and feedback style on the next screen.
        </p>
      </section>

      {error ? (
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-lg border border-border p-6 bg-card">
            <p className="text-sm font-medium mb-1">
              Couldn&rsquo;t load the scenario catalog.
            </p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </section>
      ) : (
        <StartClient
          scenariosByCategory={Object.fromEntries(grouped) as Record<string, Scenario[]>}
          categoryLabels={CATEGORY_LABELS}
          categoryOrder={CATEGORY_ORDER as unknown as string[]}
        />
      )}
    </main>
  );
}
