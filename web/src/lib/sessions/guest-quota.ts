import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { hashGuestCookieValue } from "@/lib/auth/guest-cookie";

/**
 * Guest session quota (per FR-1.1): a guest cookie may complete up to
 * MAX_GUEST_SESSIONS sessions before hitting the signup wall.
 *
 * Called from POST /api/sessions to enforce the cap.
 */
export const MAX_GUEST_SESSIONS = 2;

export interface GuestQuotaResult {
  hash: string;
  usedCount: number;
  atLimit: boolean;
}

export async function checkGuestQuota(
  guestId: string,
): Promise<GuestQuotaResult> {
  const hash = await hashGuestCookieValue(guestId);
  const db = createSupabaseServiceClient();

  const { count, error } = await db
    .from("sessions")
    .select("id", { count: "exact", head: true })
    .eq("guest_cookie_hash", hash);

  if (error) throw error;

  const usedCount = count ?? 0;
  return {
    hash,
    usedCount,
    atLimit: usedCount >= MAX_GUEST_SESSIONS,
  };
}
