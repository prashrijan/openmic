import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Resolved caller identity. Every API route should compute this at the top
 * and dispatch based on `kind`.
 *
 * `kind === "user"` — signed-in user, use RLS-scoped client
 * `kind === "guest"` — anonymous, use service-role client with `guest_cookie_hash` filter
 */
export type Identity =
  | { kind: "user"; userId: string }
  | { kind: "guest"; guestId: string };

/**
 * Resolve the caller from the request context.
 * - Prefer authenticated Supabase session
 * - Fall back to the HMAC-verified guest ID injected by proxy.ts
 */
export async function resolveIdentity(): Promise<Identity> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return { kind: "user", userId: user.id };
  }

  const guestId = (await headers()).get("x-openmic-guest-id");
  if (!guestId) {
    throw new Error(
      "No guest ID header — is proxy.ts running for this route? See src/proxy.ts",
    );
  }
  return { kind: "guest", guestId };
}
