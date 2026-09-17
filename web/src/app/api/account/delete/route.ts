import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

/**
 * POST /api/account/delete
 *
 * Deletes the current user (auth.users) via the admin API. Cascades to
 * profiles → sessions → messages → feedback_reports. Flags set the
 * user_id to NULL (per schema).
 *
 * See docs/03-architecture.md §11.3 (privacy — completes within request).
 */
export async function POST() {
  const userDb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await userDb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const service = createSupabaseServiceClient();
  const { error: deleteErr } = await service.auth.admin.deleteUser(user.id);
  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 });
  }

  // Client-side signOut cookie clear (session tokens are already invalid
  // once the user record is gone, but this cleans up the browser state).
  await userDb.auth.signOut();

  return NextResponse.json({ ok: true });
}
