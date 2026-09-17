import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { hashGuestCookieValue } from "@/lib/auth/guest-cookie";
import type { MessageRow, Scenario, SessionRow } from "@/lib/types";

export interface SessionBundle {
  session: SessionRow;
  scenario: Scenario | null;
  messages: MessageRow[];
  identity: { kind: "user"; userId: string } | { kind: "guest"; guestId: string };
}

/**
 * Load a session + its scenario + its messages, ensuring the current caller
 * (signed-in user or verified guest) is the owner.
 *
 * Returns null if the session doesn't exist or the caller doesn't own it.
 */
export async function getSessionBundle(
  sessionId: string,
): Promise<SessionBundle | null> {
  const userDb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await userDb.auth.getUser();

  // Try user-scoped read first (RLS enforces ownership)
  if (user) {
    const res = await userDb.from("sessions").select("*").eq("id", sessionId).maybeSingle();
    if (res.data) {
      const s = res.data as SessionRow;
      const [scenario, messages] = await Promise.all([
        loadScenario(s.scenario_id),
        userDb
          .from("messages")
          .select("*")
          .eq("session_id", s.id)
          .order("created_at", { ascending: true })
          .then((r) => (r.data ?? []) as MessageRow[]),
      ]);
      return {
        session: s,
        scenario,
        messages,
        identity: { kind: "user", userId: user.id },
      };
    }
  }

  // Guest fallback — service-role read filtered by cookie hash
  const guestId = (await headers()).get("x-openmic-guest-id");
  if (!guestId) return null;

  const hash = await hashGuestCookieValue(guestId);
  const serviceDb = createSupabaseServiceClient();

  const { data: sessionData } = await serviceDb
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("guest_cookie_hash", hash)
    .maybeSingle();

  if (!sessionData) return null;
  const s = sessionData as SessionRow;

  const [scenario, messages] = await Promise.all([
    loadScenario(s.scenario_id),
    serviceDb
      .from("messages")
      .select("*")
      .eq("session_id", s.id)
      .order("created_at", { ascending: true })
      .then((r) => (r.data ?? []) as MessageRow[]),
  ]);

  return {
    session: s,
    scenario,
    messages,
    identity: { kind: "guest", guestId },
  };
}

async function loadScenario(scenarioId: string | null): Promise<Scenario | null> {
  if (!scenarioId) return null;
  const db = await createSupabaseServerClient();
  const { data } = await db.from("scenarios").select("*").eq("id", scenarioId).maybeSingle();
  return (data as Scenario | null) ?? null;
}
