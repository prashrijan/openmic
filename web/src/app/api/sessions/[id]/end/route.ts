import { NextResponse } from "next/server";
import { getSessionBundle } from "@/lib/sessions/access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

/**
 * POST /api/sessions/[id]/end
 *
 * Slice 2 scope: mark the session as ended and set ended_at.
 * Slice 3 will add: generate the feedback report with Claude Sonnet
 * and insert it into feedback_reports.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: sessionId } = await params;

  const bundle = await getSessionBundle(sessionId);
  if (!bundle) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  if (bundle.session.status !== "active") {
    return NextResponse.json(
      { error: "Session already ended", status: bundle.session.status },
      { status: 409 },
    );
  }

  const writeDb =
    bundle.identity.kind === "user"
      ? await createSupabaseServerClient()
      : createSupabaseServiceClient();

  const { data, error } = await writeDb
    .from("sessions")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("id", sessionId)
    .select("id, status, ended_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...data,
    feedbackReportPending: true, // Slice 3 will change this to a real report id
  });
}
