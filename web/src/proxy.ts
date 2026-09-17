import { NextResponse, type NextRequest } from "next/server";
import {
  GUEST_COOKIE_MAX_AGE_SECONDS,
  GUEST_COOKIE_NAME,
  signNewGuestCookie,
  verifyGuestCookie,
} from "@/lib/auth/guest-cookie";

/**
 * Next.js 16 proxy (formerly middleware) — runs before every matched request.
 *
 * Responsibilities per docs/03-architecture.md §5:
 *   - Read the om_guest cookie, verify its HMAC signature
 *   - If missing, tampered, or absent, issue a new signed cookie
 *   - Attach the verified guest ID to a request header so route handlers
 *     can read it without re-verifying
 *
 * Route handlers should read the ID via:
 *   const guestId = (await headers()).get("x-openmic-guest-id");
 *
 * If the user is authenticated, route handlers should prefer auth.uid()
 * over the guest header — the header is informational, not authoritative.
 */
export async function proxy(request: NextRequest) {
  const existing = request.cookies.get(GUEST_COOKIE_NAME)?.value;
  let guestId: string | null = existing ? await verifyGuestCookie(existing) : null;

  let issueCookie: { name: string; value: string } | null = null;
  if (!guestId) {
    const { guestId: newId, cookieValue } = await signNewGuestCookie();
    guestId = newId;
    issueCookie = { name: GUEST_COOKIE_NAME, value: cookieValue };
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-openmic-guest-id", guestId);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (issueCookie) {
    response.cookies.set({
      name: issueCookie.name,
      value: issueCookie.value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: GUEST_COOKIE_MAX_AGE_SECONDS,
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2)$).*)",
  ],
};
