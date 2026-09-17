// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  hashGuestCookieValue,
  signNewGuestCookie,
  verifyGuestCookie,
} from "./guest-cookie";

describe("guest-cookie", () => {
  it("round-trips a signed cookie", async () => {
    const { guestId, cookieValue } = await signNewGuestCookie();
    const verified = await verifyGuestCookie(cookieValue);
    expect(verified).toBe(guestId);
  });

  it("issues distinct guest ids for consecutive calls", async () => {
    const a = await signNewGuestCookie();
    const b = await signNewGuestCookie();
    expect(a.guestId).not.toBe(b.guestId);
  });

  it("rejects a tampered signature", async () => {
    const { cookieValue } = await signNewGuestCookie();
    const [id, sig] = cookieValue.split(".");
    // Flip a hex digit in the signature
    const tampered = `${id}.${sig.replace(/[0-9a-f]/, (c) => (c === "0" ? "1" : "0"))}`;
    expect(await verifyGuestCookie(tampered)).toBeNull();
  });

  it("rejects a swapped guest id", async () => {
    const { cookieValue } = await signNewGuestCookie();
    const [, sig] = cookieValue.split(".");
    const otherId = crypto.randomUUID();
    expect(await verifyGuestCookie(`${otherId}.${sig}`)).toBeNull();
  });

  it("rejects malformed cookies", async () => {
    expect(await verifyGuestCookie("")).toBeNull();
    expect(await verifyGuestCookie("garbage")).toBeNull();
    expect(await verifyGuestCookie("abc.zz")).toBeNull(); // invalid hex
    expect(await verifyGuestCookie(".signature")).toBeNull(); // empty id
  });

  it("produces stable sha-256 hashes of length 64", async () => {
    const hash1 = await hashGuestCookieValue("some-cookie-value");
    const hash2 = await hashGuestCookieValue("some-cookie-value");
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
    expect(hash1).toMatch(/^[0-9a-f]+$/);
  });

  it("hashes different inputs to different digests", async () => {
    const a = await hashGuestCookieValue("value-a");
    const b = await hashGuestCookieValue("value-b");
    expect(a).not.toBe(b);
  });
});
