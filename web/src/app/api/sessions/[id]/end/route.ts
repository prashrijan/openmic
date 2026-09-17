import { NextResponse } from "next/server";
import { generateFeedbackReport } from "@/lib/anthropic/feedback-report";
import { getSessionBundle } from "@/lib/sessions/access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

/**
 * POST /api/sessions/[id]/end
 *
 * 1. Verify caller owns the active session
 * 2. Mark session ended
 * 3. Generate the feedback report (Claude Sonnet) and insert it
 * 4. Return the report id + a summary
 *
 * If report generation fails, the session still gets marked ended; the
 * client is told the report is missing and can offer a retry later.
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

  // 1. Mark session ended
  const { error: endErr } = await writeDb
    .from("sessions")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (endErr) {
    return NextResponse.json({ error: endErr.message }, { status: 500 });
  }

  // 2. Generate feedback report
  try {
    const report = await generateFeedbackReport(
      bundle.session,
      bundle.scenario,
      bundle.messages,
    );

    const { data: inserted, error: insertErr } = await writeDb
      .from("feedback_reports")
      .insert({
        session_id: sessionId,
        strengths: report.content.strengths,
        growth_areas: report.content.growth_areas,
        suggestions: report.content.suggestions,
        raw_report: report.raw,
        model: report.model,
        prompt_tokens: report.promptTokens,
        completion_tokens: report.completionTokens,
      })
      .select("id")
      .single();

    if (insertErr || !inserted) {
      return NextResponse.json(
        {
          sessionEnded: true,
          reportError: insertErr?.message ?? "Failed to save report",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      sessionId,
      reportId: inserted.id,
      status: "ended",
    });
  } catch (err) {
    return NextResponse.json(
      {
        sessionEnded: true,
        reportError:
          err instanceof Error ? err.message : "Report generation failed",
      },
      { status: 500 },
    );
  }
}
