import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  displayName: z.string().min(1).max(100).nullable(),
  practiceGoals: z
    .array(
      z.enum([
        "interviews",
        "meetings-work",
        "small-talk",
        "esl-fluency",
        "difficult-conversations",
      ]),
    )
    .max(5),
  preferredFeedbackMode: z.enum(["natural", "coach"]),
});

/**
 * PATCH /api/account/profile
 * Updates the current user's profile row (RLS enforces ownership).
 */
export async function PATCH(request: NextRequest) {
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid profile data", details: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }

  const { error } = await db
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      practice_goals: parsed.data.practiceGoals,
      preferred_feedback_mode: parsed.data.preferredFeedbackMode,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
