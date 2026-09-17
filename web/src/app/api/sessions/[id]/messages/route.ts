import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { anthropic, MODELS } from "@/lib/anthropic/client";
import { buildSystemPrompt } from "@/lib/anthropic/prompts";
import { getSessionBundle } from "@/lib/sessions/access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type { MessageRow } from "@/lib/types";

const bodySchema = z.object({
  content: z.string().min(1).max(5000),
});

const MAX_CONTEXT_MESSAGES = 20;

/**
 * POST /api/sessions/[id]/messages
 * Body: { content: string }
 * Response: text/event-stream with `token`, `done`, `error` events.
 *
 * Persists the user message, streams a Claude Haiku reply, persists the AI
 * message when the stream completes. See docs/03-architecture.md §7 & §8.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: sessionId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid content — must be 1 to 5000 characters." },
      { status: 400 },
    );
  }
  const userContent = parsed.data.content.trim();

  const bundle = await getSessionBundle(sessionId);
  if (!bundle) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  if (bundle.session.status !== "active") {
    return NextResponse.json(
      { error: "Session is no longer active" },
      { status: 409 },
    );
  }

  // Choose the write client based on identity (guest sessions bypass RLS)
  const writeDb =
    bundle.identity.kind === "user"
      ? await createSupabaseServerClient()
      : createSupabaseServiceClient();

  // 1. Persist the user's message
  const { data: userMsg, error: userMsgErr } = await writeDb
    .from("messages")
    .insert({ session_id: sessionId, sender: "user", content: userContent })
    .select("*")
    .single();

  if (userMsgErr || !userMsg) {
    return NextResponse.json(
      { error: userMsgErr?.message ?? "Failed to save your message" },
      { status: 500 },
    );
  }

  // 2. Build the conversation payload for Claude
  const history: MessageRow[] = [...bundle.messages, userMsg as MessageRow];
  const contextWindow = history.slice(-MAX_CONTEXT_MESSAGES);
  const claudeMessages = contextWindow
    .filter((m) => m.sender === "user" || m.sender === "ai")
    .map((m) => ({
      role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }));

  const systemPrompt = buildSystemPrompt(bundle.session, bundle.scenario);

  // 3. Kick off Claude stream and pipe to SSE
  const encoder = new TextEncoder();
  const sseStream = new ReadableStream({
    async start(controller) {
      const emit = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      let fullText = "";
      let inputTokens: number | null = null;
      let outputTokens: number | null = null;

      try {
        const stream = anthropic().messages.stream({
          model: MODELS.conversation,
          max_tokens: 1024,
          system: [
            {
              type: "text",
              text: systemPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: claudeMessages,
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullText += event.delta.text;
            emit("token", { delta: event.delta.text });
          }
        }

        const final = await stream.finalMessage();
        inputTokens = final.usage.input_tokens;
        outputTokens = final.usage.output_tokens;

        // 4. Persist AI message
        const { data: aiMsg } = await writeDb
          .from("messages")
          .insert({
            session_id: sessionId,
            sender: "ai",
            content: fullText,
            token_count: outputTokens,
          })
          .select("id, created_at")
          .single();

        emit("done", {
          messageId: aiMsg?.id ?? null,
          usage: {
            input_tokens: inputTokens,
            output_tokens: outputTokens,
          },
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Streaming failed";
        emit("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(sseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
