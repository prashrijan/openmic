import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Scenario } from "@/lib/types";

/**
 * GET /api/scenarios
 * Public endpoint (RLS allows select on active scenarios).
 */
export async function GET() {
  const db = await createSupabaseServerClient();

  const { data, error } = await db
    .from("scenarios")
    .select(
      "id, slug, category, title, description, suggested_ai_role, suggested_difficulty, system_prompt_template, is_active, display_order",
    )
    .eq("is_active", true)
    .order("category")
    .order("display_order");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ scenarios: (data ?? []) as Scenario[] });
}
