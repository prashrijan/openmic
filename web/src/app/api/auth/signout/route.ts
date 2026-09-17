import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/signout — clears the Supabase session cookies.
 */
export async function POST() {
  const db = await createSupabaseServerClient();
  await db.auth.signOut();
  return NextResponse.json({ ok: true });
}
