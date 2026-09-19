"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, MessageSquareText, Send, Square } from "lucide-react";
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

  useEffect(() => {
    const startTime = new Date(session.started_at).getTime();
    const id = setInterval(() => setElapsedMs(Date.now() - startTime), 1000);
    return () => clearInterval(id);
  }, [session.started_at]);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pendingAiText]);

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
  const percentElapsed = Math.min(100, (elapsedMs / SESSION_CAP_MS) * 100);
  const softWrapReached = elapsedMs >= SOFT_WRAP_MS;
  const displayTime = formatTime(remainingMs);

  const aiLabel = scenario ? scenario.suggested_ai_role : session.ai_role;
  const title = scenario ? scenario.title : "Custom topic";

  return (
    <main className="flex-1 flex flex-col min-h-0">
      {/* ============ SESSION HEADER ============ */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-1.5 inline-flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live session
              </p>
              <h1 className="font-serif text-2xl md:text-3xl tracking-tight leading-tight truncate">
                {title}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span>
                  Playing{" "}
                  <span className="text-foreground font-medium">{aiLabel}</span>
                </span>
                <span className="text-border">·</span>
                <span className="capitalize">{session.difficulty}</span>
                <span className="text-border">·</span>
                <span>
                  {session.feedback_mode === "natural"
                    ? "Natural flow"
                    : "Coach mode"}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p
                className={`font-mono text-2xl tabular-nums leading-none ${
                  softWrapReached ? "text-destructive" : "text-foreground"
                }`}
                aria-live="polite"
              >
                {displayTime}
              </p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-1.5">
                remaining
              </p>
              <button
                type="button"
                onClick={handleEnd}
                disabled={ending}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive disabled:opacity-50 transition"
              >
                <Square className="w-2.5 h-2.5" strokeWidth={2} fill="currentColor" />
                {ending ? "Ending…" : "End session"}
              </button>
            </div>
          </div>

          {/* progress bar */}
          <div className="mt-4 h-0.5 bg-border/50 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${softWrapReached ? "bg-destructive" : "bg-primary/70"}`}
              style={{ width: `${percentElapsed}%` }}
              aria-hidden
            />
          </div>

          {softWrapReached && !timeUp && (
            <div className="mt-3 text-xs text-destructive flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              Wrapping up — the session will end automatically at 0:00.
            </div>
          )}
        </div>
      </header>

      {/* ============ TRANSCRIPT ============ */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-10 md:py-14 space-y-8">
          {messages.length === 0 && !pendingAiText && (
            <div className="rounded-lg bg-card/50 border border-border/60 p-10 md:p-14 text-center">
              <MessageSquareText
                className="w-7 h-7 text-primary/60 mx-auto mb-4"
                strokeWidth={1.4}
              />
              <p className="font-serif text-xl tracking-tight text-foreground mb-2">
                {aiLabel} is listening.
              </p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
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
            <MessageTurn
              sender="ai"
              content={pendingAiText}
              aiLabel={aiLabel}
              pending
            />
          )}

          {sending && !pendingAiText && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex gap-1">
                <span className="w-1 h-1 rounded-full bg-muted-foreground/60 animate-pulse" />
                <span
                  className="w-1 h-1 rounded-full bg-muted-foreground/60 animate-pulse"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-1 h-1 rounded-full bg-muted-foreground/60 animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                />
              </span>
              {aiLabel} is thinking&hellip;
            </div>
          )}

          {error && (
            <div className="rounded-md bg-card border border-destructive/30 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div ref={scrollAnchor} />
        </div>
      </div>

      {/* ============ COMPOSER ============ */}
      <form
        onSubmit={sendMessage}
        className="border-t border-border bg-background/95 backdrop-blur"
      >
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="rounded-lg bg-card border border-border/60 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition p-3">
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
              className="w-full bg-transparent text-sm outline-none resize-none disabled:opacity-50 min-h-[3rem] p-1"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
              <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
                <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background text-[10px] font-mono border border-border">
                  <CornerDownLeft className="w-2.5 h-2.5" strokeWidth={2} />
                  Enter
                </kbd>
                to send · <span className="font-mono">Shift+Enter</span> for
                newline
              </p>
              <button
                type="submit"
                disabled={!input.trim() || sending || timeUp || ending}
                aria-label="Send message"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40 hover:brightness-95 transition"
              >
                <Send className="w-3.5 h-3.5" strokeWidth={2} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
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
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-2.5 inline-flex items-center gap-2">
        <span
          className={`inline-block w-1 h-1 rounded-full ${
            isUser ? "bg-primary" : "bg-muted-foreground/60"
          }`}
        />
        {label}
      </p>
      <div
        className={
          isUser
            ? "rounded-lg bg-card p-5 text-foreground"
            : "text-foreground pl-1"
        }
      >
        {parts.map((p, i) =>
          p.kind === "text" ? (
            <p
              key={i}
              className={`whitespace-pre-wrap leading-relaxed ${isUser ? "text-base" : "text-base"}`}
            >
              {p.text}
              {pending && i === parts.length - 1 && (
                <span className="inline-block ml-0.5 w-0.5 h-4 bg-foreground/50 align-middle animate-pulse" />
              )}
            </p>
          ) : (
            <div
              key={i}
              className="mt-3 rounded-md bg-primary/5 border-l-2 border-primary/40 p-3 text-sm"
            >
              <p className="uppercase text-[10px] tracking-[0.14em] text-primary/80 mb-1 font-medium">
                Coach note
              </p>
              <p className="italic text-muted-foreground leading-relaxed">
                {p.text}
              </p>
            </div>
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
