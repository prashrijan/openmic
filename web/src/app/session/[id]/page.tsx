import { notFound, redirect } from "next/navigation";
import { getSessionBundle } from "@/lib/sessions/access";
import { ChatClient } from "./ChatClient";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function SessionPage({ params }: Props) {
  const { id } = await params;
  const bundle = await getSessionBundle(id);
  if (!bundle) notFound();

  // If already ended, kick the user to the report view
  if (bundle.session.status !== "active") {
    redirect(`/session/${id}/report`);
  }

  return (
    <ChatClient
      session={bundle.session}
      scenario={bundle.scenario}
      initialMessages={bundle.messages}
    />
  );
}
