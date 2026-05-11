"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { Question, initialQuestions } from "@/data/questions";

interface LiveQAProps {
  initialQuestions?: Question[];
}

export const LiveQA = ({ initialQuestions: propQuestions }: LiveQAProps) => {
  const ref = useReveal<HTMLDivElement>();
  const [questions, setQuestions] = useState(propQuestions || initialQuestions);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");

  const upvote = (id: string) => {
    setQuestions((qs) =>
      [...qs]
        .map((q) => (q.id === id ? { ...q, votes: q.voted ? q.votes - 1 : q.votes + 1, voted: !q.voted } : q))
        .sort((a, b) => b.votes - a.votes)
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setQuestions((qs) =>
      [
        ...qs,
        { id: String(Date.now()), text: draft.trim(), author: name.trim() || "Anonymous", votes: 1, voted: true, emoji: "" },
      ].sort((a, b) => b.votes - a.votes)
    );
    setDraft("");
    setName("");
  };

  return (
    <section
      id="qa"
      className="relative py-28 md:py-40 overflow-hidden"
    >

      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="label-mono text-accent mb-6">§ 02 — Live Q&A</p>
            <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] text-foreground">
              The room
              <br />
              <span className="text-accent">talks back.</span>
            </h2>
            <p className="mt-6 text-foreground/70 max-w-md leading-relaxed text-lg">
              Anyone can drop a question — anonymously or not. The crowd upvotes the ones that
              matter. No moderation queue, no friction, no awkward microphones.
            </p>
            <ul className="mt-8 space-y-2 text-foreground/65">
              <li>→ Auto-detects when a session is live</li>
              <li>→ Anonymous mode for shy rooms</li>
              <li>→ Sorted by upvotes, in real time</li>
              <li>→ Works on any phone, no app to install</li>
            </ul>
          </div>

          <div ref={ref} className="reveal-up lg:col-span-7">
            <div className="bg-glass text-foreground squircle-lg overflow-hidden border border-border shadow-deep">
              {/* Card header — matches reference */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div>
                  <p className="label-mono text-foreground/50">STAGE A · 14:30 — 15:15</p>
                  <p className="font-display font-bold text-2xl mt-1">Designing for live attention</p>
                </div>
                <span className="label-mono pill flex items-center gap-2 px-3 py-1.5 glow-chip">
                  <span className="w-1.5 h-1.5 rounded-full bg-glass blink-dot" />
                  LIVE
                </span>
              </div>

              {/* Question form */}
              <form onSubmit={submit} className="px-6 py-5 border-b border-border bg-glass">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask a question…"
                  rows={2}
                  className="w-full bg-transparent resize-none focus:outline-none text-foreground placeholder:text-foreground/40"
                />
                <div className="flex items-center justify-between mt-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name (optional)"
                    className="bg-transparent label-mono text-foreground/70 placeholder:text-foreground/35 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="label-mono pill px-5 py-2 bg-accent text-accent-foreground hover:opacity-90 transition disabled:opacity-30 lift squish"
                    disabled={!draft.trim()}
                  >
                    Send →
                  </button>
                </div>
              </form>

              {/* Questions list */}
              <ul className="divide-y divide-border max-h-[420px] overflow-auto">
                {questions.map((q) => (
                   <li key={q.id} className="flex gap-4 px-6 py-4 hover:bg-glass">
                    <button
                      onClick={() => upvote(q.id)}
                      className={`squircle squish flex flex-col items-center justify-center min-w-[52px] py-2 border transition-all ${
                        q.voted
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border text-foreground/70 hover:border-accent hover:text-accent"
                      }`}
                    >
                      <span className="text-sm leading-none">▲</span>
                      <span className="font-display font-bold text-lg leading-none mt-1">{q.votes}</span>
                    </button>
                    <div className="flex-1">
                      <p className="text-foreground leading-snug">
                        {q.text}
                      </p>
                      <p className="label-mono text-foreground/45 mt-1">— {q.author}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
