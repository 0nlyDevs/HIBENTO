"use client";

import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Question, initialQuestions } from "@/data/questions";
import SwipeLettersButton from "@/components/ui/SwipeLetterButton";
import { TypingAnimation } from "@/components/ui/typing-animation";

const MAX_CHARS = 280;

interface LiveQAProps {
  initialQuestions?: Question[];
}

export const LiveQA = ({ initialQuestions: propQuestions }: LiveQAProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [questions, setQuestions] = useState(propQuestions || initialQuestions);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");
  const [flashId, setFlashId] = useState<string | null>(null);

  const upvote = (id: string) => {
    setQuestions((qs) =>
      [...qs]
        .map((q) => (q.id === id ? { ...q, upvotes: q.voted ? q.upvotes - 1 : q.upvotes + 1, voted: !q.voted } : q))
        .sort((a, b) => b.upvotes - a.upvotes)
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    const newId = String(Date.now());
    setQuestions((qs) =>
      [
        ...qs,
        { id: newId, content: trimmed, authorName: name.trim() || "Anonymous", upvotes: 1, voted: true, isNew: true },
      ].sort((a, b) => b.upvotes - a.upvotes)
    );
    setDraft("");
    setName("");
    setFlashId(newId);
    setTimeout(() => setFlashId(null), 1800);
    setTimeout(() => {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  const remaining = MAX_CHARS - draft.length;
  const canSubmit = draft.trim().length > 0 && draft.length <= MAX_CHARS;

  let remainingColor: string;
  if (remaining < 10) {
    remainingColor = "text-rose-400";
  } else if (remaining < 40) {
    remainingColor = "text-accent";
  } else {
    remainingColor = "text-foreground/25";
  }

  return (
    <section id="qa" className="relative pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 lg:px-20 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-end">

          <div className="lg:col-span-5 md:rotate-2 md:-translate-y-20 card-glass squircle-lg p-8 lift">
            <p className="label-mono text-accent mb-6">§ 02 Live Q&A</p>
            <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] text-foreground">
              The room
              <br />
              <span className="text-accent">talks back.</span>
            </h2>
            <p className="mt-6 text-foreground/70 max-w-md leading-relaxed text-lg">
              Anyone can drop a question, anonymously or not. The crowd upvotes the ones that
              matter. No moderation queue, no friction, no awkward microphones.
            </p>
            <ul className="mt-8 space-y-3 text-foreground/65">
              {[
                "Auto-detects when a session is live",
                "Anonymous mode for shy rooms",
                "Sorted by upvotes, in real time",
                "Works on any phone, no app to install",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7 md:-rotate-1 flex flex-col gap-4">

            <div className="relative w-3/4 self-start h-52 squircle-lg overflow-hidden md:-rotate-3 shadow-deep md:-translate-y-16 md:translate-x-4">
              <Image
                src="/images/liveqa.jpg"
                alt="Live Q&A in action"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 40vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>

            <div className="squircle-lg card-glass overflow-hidden shadow-deep">

                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                  <div>
                    <p className="label-mono text-foreground/50">STAGE A · 14:30 to 15:15</p>
                    <p className="font-display font-bold text-xl mt-0.5 text-foreground">
                      Designing for live attention
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="label-mono text-foreground/40">{questions.length} questions</span>
                    <span className="label-mono pill flex items-center gap-2 px-3 py-1.5 glow-chip text-chartreuse-soft font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-charcoal" />
                      LIVE
                    </span>
                  </div>
                </div>

              <form onSubmit={submit} className="px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="relative">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value.slice(0, MAX_CHARS))}
                    rows={2}
                    className="w-full bg-transparent resize-none focus:outline-none text-foreground text-sm leading-relaxed relative z-10"
                  />
                  {!draft && (
                    <div className="absolute top-0 left-0 pointer-events-none text-foreground/30 text-sm leading-relaxed">
                      <TypingAnimation
                        words={["Ask a question…", "What would you like to know?", "Your question matters…"]}
                        cursorStyle="underscore"
                        loop
                        duration={60}
                        pauseDelay={2000}
                        className="text-sm font-normal tracking-normal leading-relaxed"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0 relative">
                    <div className="relative flex-1 min-w-0 flex items-center">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent label-mono text-foreground/60 focus:outline-none w-full relative z-10"
                      />
                      {!name && (
                        <div className="absolute inset-0 flex items-center pointer-events-none">
                          <TypingAnimation
                            words={["Your name…", "Anonymous"]}
                            cursorStyle="underscore"
                            loop
                            duration={80}
                            pauseDelay={2500}
                            className="label-mono text-foreground/30 font-normal tracking-[0.12em] uppercase"
                          />
                        </div>
                      )}
                    </div>
                    <span className={`label-mono shrink-0 tabular-nums ${remainingColor}`}>
                      {remaining}
                    </span>
                  </div>
                  <SwipeLettersButton
                    as="button"
                    onClick={submit as unknown as () => void}
                    label="Send →"
                    fontSize="0.7rem"
                    fontWeight={500}
                    direction="top"
                    textColor="hsl(260 9% 18%)"
                    hoverTextColor="hsl(260 9% 18%)"
                    className={`label-mono pill px-5 py-2 bg-accent transition-opacity squish shrink-0${!canSubmit ? " opacity-30 pointer-events-none" : ""}`}
                  />
                </div>
              </form>

              {questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-foreground/30">
                  <span className="text-4xl mb-3">💬</span>
                  <p className="label-mono">No questions yet. Be the first.</p>
                </div>
              ) : (
                <ul ref={listRef} className="divide-y divide-white/10 max-h-96 overflow-auto">
                  {questions.map((q, idx) => (
                    <li
                      key={q.id}
                      className={`flex items-center gap-4 px-6 py-4 transition-colors duration-300 ${
                        flashId === q.id ? "bg-accent/10" : "hover:bg-white/5"
                      }`}
                    >

                      <div className="flex-1 min-w-0">
                        <p className={`leading-snug text-sm ${idx === 0 ? "text-foreground font-medium" : "text-foreground/80"}`}>
                          {q.content}
                        </p>
                        <p className="label-mono text-foreground/40 mt-1.5">{q.authorName}</p>
                      </div>

                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          onClick={() => upvote(q.id)}
                          className={`pill squish cursor-pointer flex items-center justify-center w-14 h-9 transition-all ${
                            q.voted
                              ? "bg-accent text-accent-foreground"
                              : "bg-chartreuse-pale/15 text-foreground/50 hover:bg-chartreuse-pale/30 hover:text-foreground"
                          }`}
                        >
                          <ThumbsUp
                            size={16}
                            className=""
                          />
                        </button>
                        <span className={`font-display font-bold text-sm leading-none ${q.voted ? "text-accent" : "text-foreground/50"}`}>
                          {q.upvotes}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
