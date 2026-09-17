import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LoginClient } from "./LoginClient";

interface Props {
  searchParams: Promise<{ next?: string; reason?: string }>;
}

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: Props) {
  const { next, reason } = await searchParams;

  // If already signed in, bounce to the intended destination
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (user) redirect(next && next.startsWith("/") ? next : "/");

  return <LoginClient next={next ?? "/"} reason={reason} />;
}
