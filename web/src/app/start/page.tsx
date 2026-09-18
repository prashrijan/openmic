import Image from "next/image";
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
      {/* Editorial hero — copy left, atmospheric photo right */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-16 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-5 inline-flex items-center gap-3">
              <span className="w-8 h-px bg-primary" />
              Step 1 of 2
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-foreground">
              What do you
              <br />
              <em className="not-italic" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                want to practice?
              </em>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl">
              Pick a scenario below, or describe your own in a sentence.
              You&rsquo;ll tweak the role, difficulty, and feedback style on
              the next screen.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-card">
              <Image
                src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=1000&q=85&auto=format&fit=crop"
                alt="A hand writing in a notebook &mdash; the practice space"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0 pointer-events-none mix-blend-multiply"
                style={{ background: "rgba(240, 237, 231, 0.12)" }}
                aria-hidden
              />
            </div>
          </div>
        </div>
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
