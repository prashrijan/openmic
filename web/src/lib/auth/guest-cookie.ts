import { serverEnv } from "@/lib/env";

/**
 * HMAC-signed guest identity cookies. Uses Web Crypto so this works in both
 * the edge (proxy.ts) and node runtimes.
 *
 * Format: <uuid>.<hex-hmac>
 * See docs/03-architecture.md §5.2.
 */

export const GUEST_COOKIE_NAME = "om_guest";
export const GUEST_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

async function getKey(): Promise<CryptoKey> {
  const secret = serverEnv().GUEST_COOKIE_HMAC_SECRET;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signPayload(payload: string): Promise<string> {
  const key = await getKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return bufferToHex(new Uint8Array(signature));
}

async function verifyPayload(payload: string, signatureHex: string): Promise<boolean> {
  const key = await getKey();
  const signature = hexToBuffer(signatureHex);
  if (signature.byteLength === 0) return false;
  return crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    new TextEncoder().encode(payload),
  );
}

export async function signNewGuestCookie(): Promise<{
  guestId: string;
  cookieValue: string;
}> {
  const guestId = crypto.randomUUID();
  const signature = await signPayload(guestId);
  return { guestId, cookieValue: `${guestId}.${signature}` };
}

export async function verifyGuestCookie(cookieValue: string): Promise<string | null> {
  const dot = cookieValue.indexOf(".");
  if (dot === -1) return null;
  const guestId = cookieValue.slice(0, dot);
  const signature = cookieValue.slice(dot + 1);
  if (!guestId || !signature) return null;
  const ok = await verifyPayload(guestId, signature);
  return ok ? guestId : null;
}

/**
 * SHA-256 hash of the raw cookie value — this is what we store in the DB
 * (never the raw cookie). See docs/03-architecture.md §5.2 for rationale.
 */
export async function hashGuestCookieValue(cookieValue: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(cookieValue),
  );
  return bufferToHex(new Uint8Array(digest));
}

function bufferToHex(bytes: Uint8Array): string {
  let hex = "";
  for (const b of bytes) {
    hex += b.toString(16).padStart(2, "0");
  }
  return hex;
}

function hexToBuffer(hex: string): ArrayBuffer {
  if (hex.length === 0 || hex.length % 2 !== 0) return new ArrayBuffer(0);
  const buffer = new ArrayBuffer(hex.length / 2);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < view.length; i++) {
    const byte = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) return new ArrayBuffer(0);
    view[i] = byte;
  }
  return buffer;
}
