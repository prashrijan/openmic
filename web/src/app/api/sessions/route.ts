import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { resolveIdentity } from "@/lib/api/identity";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { createSessionSchema } from "@/lib/sessions/session-config";
import { checkGuestQuota } from "@/lib/sessions/guest-quota";

/**
 * POST /api/sessions — create a new practice session.
 * Handles both authenticated users (RLS-scoped insert) and guests
 * (service-role insert with guest_cookie_hash).
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }
  const input = parsed.data;

  const identity = await resolveIdentity();

  if (identity.kind === "guest") {
    const quota = await checkGuestQuota(identity.guestId);
    if (quota.atLimit) {
      return NextResponse.json(
        {
          error: "guest_quota_exhausted",
          message:
            "You've used your free guest sessions. Sign up to keep practicing.",
        },
        { status: 402 },
      );
    }

    const db = createSupabaseServiceClient();
    const { data, error } = await db
      .from("sessions")
      .insert({
        guest_cookie_hash: quota.hash,
        scenario_id: input.scenarioId ?? null,
        custom_topic: input.customTopic ?? null,
        ai_role: input.aiRole,
        difficulty: input.difficulty,
        feedback_mode: input.feedbackMode,
      })
      .select("id, started_at, status")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  }

  // Authenticated user path — RLS enforces user_id = auth.uid()
  const db = await createSupabaseServerClient();
  const { data, error } = await db
    .from("sessions")
    .insert({
      user_id: identity.userId,
      scenario_id: input.scenarioId ?? null,
      custom_topic: input.customTopic ?? null,
      ai_role: input.aiRole,
      difficulty: input.difficulty,
      feedback_mode: input.feedbackMode,
    })
    .select("id, started_at, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
