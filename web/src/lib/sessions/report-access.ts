import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type { FeedbackReport } from "@/lib/types";
import type { SessionBundle } from "@/lib/sessions/access";

/**
 * Load the feedback report for a session. Uses the same client type that
 * getSessionBundle already established, so guest sessions can read their
 * own report via the service-role client.
 */
export async function loadFeedbackReport(
  bundle: SessionBundle,
): Promise<FeedbackReport | null> {
  const db =
    bundle.identity.kind === "user"
      ? await createSupabaseServerClient()
      : createSupabaseServiceClient();

  const { data } = await db
    .from("feedback_reports")
    .select("*")
    .eq("session_id", bundle.session.id)
    .maybeSingle();

  return (data as FeedbackReport | null) ?? null;
}
