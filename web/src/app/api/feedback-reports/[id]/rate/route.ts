import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { hashGuestCookieValue } from "@/lib/auth/guest-cookie";

const bodySchema = z.object({
  rating: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
});

/**
 * POST /api/feedback-reports/[id]/rate
 * Body: { rating: -1 | 0 | 1 }
 *
 * A minor signal used to tune feedback prompts. Users own their session,
 * so the update is authorized via RLS for signed-in users and via
 * cookie-hash match for guests.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: reportId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  // Try user-scoped update first (RLS policy: session must be theirs)
  const userDb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await userDb.auth.getUser();

  if (user) {
    const { error } = await userDb
      .from("feedback_reports")
      .update({ rating: parsed.data.rating })
      .eq("id", reportId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // Guest path — service role, but verify the report belongs to a session
  // owned by the current guest cookie
  const guestId = (await headers()).get("x-openmic-guest-id");
  if (!guestId) {
    return NextResponse.json({ error: "No identity" }, { status: 401 });
  }
  const hash = await hashGuestCookieValue(guestId);
  const serviceDb = createSupabaseServiceClient();

  const { data: report } = await serviceDb
    .from("feedback_reports")
    .select("id, session_id")
    .eq("id", reportId)
    .maybeSingle();

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const { data: session } = await serviceDb
    .from("sessions")
    .select("id")
    .eq("id", report.session_id)
    .eq("guest_cookie_hash", hash)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { error } = await serviceDb
    .from("feedback_reports")
    .update({ rating: parsed.data.rating })
    .eq("id", reportId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
