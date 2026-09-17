"use client";

import { useState } from "react";

interface Props {
  reportId: string;
  initialRating: -1 | 0 | 1;
}

export function FeedbackRating({ reportId, initialRating }: Props) {
  const [rating, setRating] = useState<-1 | 0 | 1>(initialRating);
  const [submitting, setSubmitting] = useState(false);

  async function submit(value: -1 | 1) {
    const next: -1 | 0 | 1 = rating === value ? 0 : value;
    const previous = rating;
    setRating(next);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/feedback-reports/${reportId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: next }),
      });
      if (!res.ok) throw new Error(`Rating failed: ${res.status}`);
    } catch {
      setRating(previous);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
        Was this useful?
      </p>
      <button
        type="button"
        onClick={() => submit(1)}
        disabled={submitting}
        aria-pressed={rating === 1}
        className={`text-sm px-3 py-1.5 rounded-md transition disabled:opacity-50 ${
          rating === 1
            ? "bg-primary text-primary-foreground"
            : "bg-card hover:bg-muted"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => submit(-1)}
        disabled={submitting}
        aria-pressed={rating === -1}
        className={`text-sm px-3 py-1.5 rounded-md transition disabled:opacity-50 ${
          rating === -1
            ? "bg-primary text-primary-foreground"
            : "bg-card hover:bg-muted"
        }`}
      >
        Not really
      </button>
    </div>
  );
}
