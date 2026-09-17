import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { hashGuestCookieValue } from "@/lib/auth/guest-cookie";

/**
 * GET /auth/callback
 *
 * Handles both OAuth code exchange and magic-link redirects. On success:
 *   1. Exchange the code for a Supabase session (server cookies set)
 *   2. If the caller has a valid guest cookie, transfer their guest
 *      sessions onto the newly-authenticated user account
 *   3. Redirect to `next` (or / if absent)
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/";
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const db = await createSupabaseServerClient();
  const { error, data } = await db.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error?.message ?? "auth_failed")}`,
    );
  }

  // Transfer any guest-mode sessions to this user (best-effort; failures
  // don't block sign-in)
  try {
    const guestId = (await headers()).get("x-openmic-guest-id");
    if (guestId) {
      const hash = await hashGuestCookieValue(guestId);
      const service = createSupabaseServiceClient();
      await service
        .from("sessions")
        .update({ user_id: data.user.id, guest_cookie_hash: null })
        .eq("guest_cookie_hash", hash);
    }
  } catch (err) {
    // Log but don't fail the sign-in
    console.error("Guest-session import failed", err);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
