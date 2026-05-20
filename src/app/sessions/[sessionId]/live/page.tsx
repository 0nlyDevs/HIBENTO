"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetEventSession } from "@/lib/hooks/useSessions";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";

export default function SessionLivePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: session, isLoading } = useGetEventSession(sessionId);
  const { toast } = useToast();

  const [questionText, setQuestionText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const questions = session?.questions || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questions.length]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setIsSubmitting(true);
    try {
      await api.createQuestion(sessionId, questionText, authorName);
      setQuestionText("");
      setAuthorName("");
      toast("Question submitted!", "success");
    } catch (err) {
      console.log(err || "Failed to submit", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-charcoal border-t-yellow animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-charcoal">SESSION NOT FOUND</h1>
        <Link href={`/sessions/${sessionId}`} className="text-sm text-charcoal/60 hover:text-charcoal underline">
          Back to session
        </Link>
      </div>
    );
  }

  const now = new Date();
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  const isUpcoming = now < startTime;
  const isLive = session.isLive;
  const isEnded = now > endTime;

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-charcoal/95 backdrop-blur border-b border-cream/10">
        <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="HiBento" width={24} height={24} className="brightness-0 invert" />
            <span className="font-bold text-lg tracking-tighter text-cream">HIBENTO</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-cream/60">
              <span className="hidden sm:inline truncate max-w-[200px]">{session.title}</span>
              {isLive && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[0.6rem] font-bold bg-yellow text-charcoal ml-2">
                  <span className="w-1 h-1 bg-charcoal animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <Link
              href={`/sessions/${sessionId}`}
              className="text-xs text-cream/40 hover:text-cream flex items-center gap-1 ml-4"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              INFO
            </Link>
          </div>
        </div>
      </nav>

      {/* Streaming Layout */}
      <div className="flex flex-col lg:flex-row" style={{ height: "calc(100vh - 53px)" }}>
        {/* Video Player Area */}
        <div className="flex-1 bg-black flex flex-col">
          <div className="flex-1 flex items-center justify-center relative bg-[#1a1a1a]">
            {/* Video Placeholder */}
            <div className="text-center text-cream/30">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="mx-auto mb-4"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <p className="text-sm font-medium">Video Player Placeholder</p>
              <p className="text-xs mt-1 text-cream/20">{session.title}</p>
            </div>

            {/* Status overlay for upcoming */}
            {isUpcoming && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="w-16 h-16 bg-cream/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cream/60">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6V12L16 14" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-cream mb-2">Session Not Started</p>
                  <p className="text-sm text-cream/50">
                    Starts at{" "}
                    {startTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Ended overlay */}
            {isEnded && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center px-8">
                  <p className="text-lg font-bold text-cream mb-2">Session Ended</p>
                  <p className="text-sm text-cream/50">The stream has concluded.</p>
                </div>
              </div>
            )}
          </div>

          {/* Session Mini Info Bar */}
          <div className="bg-charcoal border-t border-cream/10 px-6 py-3 flex items-center gap-4 shrink-0">
            <div>
              <h2 className="text-sm font-bold text-cream">{session.title}</h2>
              <div className="flex items-center gap-3 text-xs text-cream/40 mt-0.5">
                <span>
                  {startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  {" – "}
                  {endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </span>
                {session.speakers.length > 0 && (
                  <span>{session.speakers.map((s) => s.name).join(", ")}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Q&A Sidebar */}
        <div
          className="w-full lg:w-[380px] bg-cream flex flex-col shrink-0 border-t lg:border-t-0 lg:border-l border-cream/10"
          style={{ height: "auto", maxHeight: "100%" }}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-charcoal/10 bg-paper shrink-0">
            <div className="flex items-center gap-3">
              {isLive && <div className="w-1.5 h-1.5 bg-nori animate-pulse" />}
              <h3 className="text-sm font-bold tracking-wider text-charcoal">
                {isLive ? "LIVE Q&A" : isUpcoming ? "NOT STARTED" : "Q&A"}
              </h3>
            </div>
            <span className="text-[0.6rem] text-charcoal/40">
              {questions.length} {questions.length === 1 ? "QUESTION" : "QUESTIONS"}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {isUpcoming ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <p className="text-sm text-charcoal/40">
                  Questions will open once the session goes live.
                </p>
              </div>
            ) : questions.length > 0 ? (
              questions.map((q) => (
                <div key={q.id} className="animate-slide-up">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-charcoal/10 flex items-center justify-center text-[0.6rem] font-bold text-charcoal/60">
                      {q.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-charcoal/60">{q.authorName}</span>
                    <span className="text-[0.6rem] text-charcoal/30">
                      {new Date(q.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="ml-8">
                    <div className="bg-rice border border-charcoal/10 p-3">
                      <p className="text-sm text-charcoal">{q.content}</p>
                    </div>
                    <button
                      onClick={() =>
                        toast("Upvote feature coming soon", "info")
                      }
                      className="flex items-center gap-1 mt-1 text-xs text-charcoal/40 hover:text-charcoal transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M6 1L10 6H8V10H4V6H2L6 1Z"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{q.upvotes}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : isEnded ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-sm text-charcoal/40">This session has ended.</p>
                <p className="text-xs text-charcoal/30 mt-1">No questions were asked.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-sm text-charcoal/40">No questions yet</p>
                {isLive && <p className="text-xs text-charcoal/30 mt-1">Be the first to ask!</p>}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input — only when session is live */}
          {isLive && (
            <form onSubmit={handleSubmitQuestion} className="border-t border-charcoal/10 p-4 bg-paper shrink-0">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 text-sm border border-charcoal/20 bg-cream text-charcoal focus:outline-none focus:border-charcoal/40"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !questionText.trim()}
                  className="px-4 py-2 bg-charcoal text-cream text-xs tracking-wider font-medium disabled:opacity-50 shrink-0"
                >
                  {isSubmitting ? "..." : "SEND"}
                </button>
              </div>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-3 py-1 text-xs border-b border-charcoal/10 bg-transparent text-charcoal/50 focus:outline-none focus:border-charcoal/30"
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
