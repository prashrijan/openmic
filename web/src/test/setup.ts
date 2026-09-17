import "@testing-library/jest-dom/vitest";

// Placeholder env vars for tests. Real values live in .env.local.
// These pass the Zod schemas in src/lib/env.ts so modules can be imported
// under test without hitting environment errors.
process.env.NEXT_PUBLIC_SUPABASE_URL ||= "https://placeholder.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= "placeholder-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY ||= "placeholder-service-role-key";
process.env.ANTHROPIC_API_KEY ||= "sk-ant-placeholder-for-tests-only";
process.env.GUEST_COOKIE_HMAC_SECRET ||= "a".repeat(64);
