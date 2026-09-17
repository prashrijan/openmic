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
      <section className="mx-auto max-w-2xl px-6 pt-16 pb-6 md:pt-20">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
          Account
        </p>
        <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight">
          {user.email}
        </h1>
      </section>

      <AccountClient
        initialDisplayName={profile.display_name ?? ""}
        initialGoals={profile.practice_goals}
        initialFeedbackMode={profile.preferred_feedback_mode}
      />
    </main>
  );
}
