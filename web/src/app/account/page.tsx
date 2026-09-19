import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FeedbackMode, ScenarioCategory } from "@/lib/types";
import { AccountClient } from "./AccountClient";

export const dynamic = "force-dynamic";

interface Profile {
  id: string;
  display_name: string | null;
  practice_goals: ScenarioCategory[];
  preferred_feedback_mode: FeedbackMode;
}

export default async function AccountPage() {
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/login?next=%2Faccount");

  const { data } = await db
    .from("profiles")
    .select("id, display_name, practice_goals, preferred_feedback_mode")
    .eq("id", user.id)
    .maybeSingle();

  const profile = (data as Profile | null) ?? {
    id: user.id,
    display_name: null,
    practice_goals: [],
    preferred_feedback_mode: "natural" as FeedbackMode,
  };

  return (
    <main className="flex-1">
      {/* Editorial hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24 md:pb-14">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-5 inline-flex items-center gap-3">
            <span className="w-8 h-px bg-primary" />
            Account
          </p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.02] tracking-tight text-foreground">
            {user.email}
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Signed in with{" "}
            {user.app_metadata?.provider === "google" ? "Google" : "email"} ·
            member since{" "}
            {new Date(user.created_at).toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      <AccountClient
        initialDisplayName={profile.display_name ?? ""}
        initialGoals={profile.practice_goals}
        initialFeedbackMode={profile.preferred_feedback_mode}
      />
    </main>
  );
}
