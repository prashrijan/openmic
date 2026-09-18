"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MessageSquareText, Send, Square } from "lucide-react";
import type { MessageRow, Scenario, SessionRow } from "@/lib/types";

interface Props {
  session: SessionRow;
  scenario: Scenario | null;
  initialMessages: MessageRow[];
}

const SESSION_CAP_MS = 15 * 60 * 1000;
const SOFT_WRAP_MS = 13 * 60 * 1000;

export function ChatClient({ session, scenario, initialMessages }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageRow[]>(initialMessages);
  const [pendingAiText, setPendingAiText] = useState<string>("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(
    () => Date.now() - new Date(session.started_at).getTime(),
  );

  const scrollAnchor = useRef<HTMLDivElement>(null);

  // Tick the elapsed timer every second
  useEffect(() => {
    const startTime = new Date(session.started_at).getTime();
    const id = setInterval(() => setElapsedMs(Date.now() - startTime), 1000);
    return () => clearInterval(id);
  }, [session.started_at]);

  // Auto-scroll to bottom on new content
  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pendingAiText]);

  // Hard cap: at 15 minutes, force-end
  const timeUp = elapsedMs >= SESSION_CAP_MS;
  useEffect(() => {
    if (timeUp && !ending) {
      void handleEnd();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  async function sendMessage(e?: FormEvent) {
    e?.preventDefault();
    if (!input.trim() || sending) return;
    const content = input.trim();
    setInput("");
    setError(null);
    setSending(true);

    // Optimistically add user message
    const tempId = crypto.randomUUID();
    const tempUserMsg: MessageRow = {
      id: tempId,
      session_id: session.id,
      sender: "user",
      content,
      token_count: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch(`/api/sessions/${session.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error ?? `Server error (${res.status})`);
      }

      // Consume SSE stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";
        for (const frame of frames) {
          const lines = frame.split("\n");
          let event = "message";
          let data = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) event = line.slice(7);
            else if (line.startsWith("data: ")) data = line.slice(6);
          }
          if (event === "token") {
            const parsed = JSON.parse(data) as { delta: string };
            aiText += parsed.delta;
            setPendingAiText(aiText);
          } else if (event === "done") {
            const parsed = JSON.parse(data) as { messageId: string | null };
            setMessages((prev) => [
              ...prev,
              {
                id: parsed.messageId ?? crypto.randomUUID(),
                session_id: session.id,
                sender: "ai",
                content: aiText,
                token_count: null,
                created_at: new Date().toISOString(),
              },
            ]);
            setPendingAiText("");
          } else if (event === "error") {
            const parsed = JSON.parse(data) as { message: string };
            throw new Error(parsed.message);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPendingAiText("");
    } finally {
      setSending(false);
    }
  }

  async function handleEnd() {
    if (ending) return;
    if (!timeUp && !confirm("End session and see feedback?")) return;
    setEnding(true);
    try {
      const res = await fetch(`/api/sessions/${session.id}/end`, {
        method: "POST",
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error ?? `Failed to end session (${res.status})`);
      }
      router.push(`/session/${session.id}/report`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to end session");
      setEnding(false);
    }
  }

  const remainingMs = Math.max(0, SESSION_CAP_MS - elapsedMs);
  const softWrapReached = elapsedMs >= SOFT_WRAP_MS;
  const displayTime = formatTime(remainingMs);

  const aiLabel = scenario ? scenario.suggested_ai_role : session.ai_role;
  const title = scenario ? scenario.title : "Custom topic";

  return (
    <main className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-1">
              Session
            </p>
            <h1 className="font-serif text-xl md:text-2xl tracking-tight truncate">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Playing {aiLabel} · {session.difficulty} ·{" "}
              {session.feedback_mode === "natural" ? "Natural flow" : "Coach mode"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p
              className={`font-mono text-sm tabular-nums ${softWrapReached ? "text-destructive" : "text-foreground"}`}
              aria-live="polite"
            >
              {displayTime}
            </p>
            <button
              type="button"
              onClick={handleEnd}
              disabled={ending}
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 transition"
            >
              <Square className="w-3 h-3" strokeWidth={2} fill="currentColor" />
              {ending ? "Ending…" : "End session"}
            </button>
          </div>
        </div>
        {softWrapReached && !timeUp && (
          <div className="mx-auto max-w-3xl px-6 pb-3 text-xs text-destructive">
            Wrapping up — the session will end automatically at 0:00.
          </div>
        )}
      </header>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
          {messages.length === 0 && !pendingAiText && (
            <div className="rounded-lg bg-card/50 border border-border/60 p-8 text-center">
              <MessageSquareText
                className="w-6 h-6 text-muted-foreground mx-auto mb-3"
                strokeWidth={1.5}
              />
              <p className="text-sm text-foreground mb-1">
                {aiLabel} is listening.
              </p>
              <p className="text-xs text-muted-foreground">
                Say something to begin. Anything works &mdash; hello, a
                question, the situation you&rsquo;re practicing.
              </p>
            </div>
          )}

          {messages.map((m) => (
            <MessageTurn
              key={m.id}
              sender={m.sender}
              content={m.content}
              aiLabel={aiLabel}
            />
          ))}

          {pendingAiText && (
            <MessageTurn sender="ai" content={pendingAiText} aiLabel={aiLabel} pending />
          )}

          {sending && !pendingAiText && (
            <p className="text-xs text-muted-foreground">
              <span className="inline-block animate-pulse">…</span>{" "}
              {aiLabel} is thinking
            </p>
          )}

          {error && (
            <div className="rounded-md bg-card p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div ref={scrollAnchor} />
        </div>
      </div>

      {/* Composer */}
      <form
        onSubmit={sendMessage}
        className="border-t border-border bg-background"
      >
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage();
              }
            }}
            placeholder="Type a message…"
            rows={2}
            disabled={sending || timeUp || ending}
            className="flex-1 rounded-md bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-primary/60 resize-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending || timeUp || ending}
            aria-label="Send message"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50 hover:brightness-95 transition"
          >
            <Send className="w-4 h-4" strokeWidth={2} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </main>
  );
}

interface TurnProps {
  sender: MessageRow["sender"];
  content: string;
  aiLabel: string;
  pending?: boolean;
}

function MessageTurn({ sender, content, aiLabel, pending }: TurnProps) {
  const label = sender === "user" ? "You" : aiLabel;

  // Extract inline coach nudges like [coach: some suggestion]
  const parts: Array<{ kind: "text" | "coach"; text: string }> = [];
  const regex = /\[coach:\s*([^\]]+)\]/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIdx) {
      parts.push({ kind: "text", text: content.slice(lastIdx, match.index) });
    }
    parts.push({ kind: "coach", text: match[1].trim() });
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < content.length) {
    parts.push({ kind: "text", text: content.slice(lastIdx) });
  }
  if (parts.length === 0) parts.push({ kind: "text", text: content });

  const isUser = sender === "user";

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">
        {label}
      </p>
      <div
        className={
          isUser
            ? "rounded-md bg-card p-4 text-foreground"
            : "text-foreground py-1"
        }
      >
        {parts.map((p, i) =>
          p.kind === "text" ? (
            <p key={i} className="whitespace-pre-wrap leading-relaxed">
              {p.text}
              {pending && i === parts.length - 1 && (
                <span className="inline-block ml-0.5 w-0.5 h-4 bg-foreground/40 align-middle animate-pulse" />
              )}
            </p>
          ) : (
            <p
              key={i}
              className="mt-3 pl-3 border-l-2 border-primary/40 text-sm text-muted-foreground italic"
            >
              <span className="not-italic uppercase text-[10px] tracking-[0.12em] mr-2 text-primary/80">
                Coach
              </span>
              {p.text}
            </p>
          ),
        )}
      </div>
    </div>
  );
}

function formatTime(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
