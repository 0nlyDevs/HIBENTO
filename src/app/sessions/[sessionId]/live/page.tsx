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
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-charcoal/10">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="HiBento" width={28} height={28} />
            <span className="font-bold text-xl tracking-tighter text-charcoal">HIBENTO</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/sessions/${sessionId}`}
              className="text-sm text-charcoal/60 hover:text-charcoal flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              SESSION INFO
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar — Session Context */}
        <div
          className="w-72 border-r border-charcoal/10 bg-paper/50 p-6 shrink-0 hidden md:block"
          style={{ height: "calc(100vh - 65px)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            {isLive && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[0.6rem] font-bold bg-nori text-cream">
                <span className="w-1 h-1 bg-cream animate-pulse" />
                LIVE
              </span>
            )}
            {isUpcoming && (
              <span className="text-[0.6rem] font-bold tracking-wider text-matcha">UPCOMING</span>
            )}
            {isEnded && (
              <span className="text-[0.6rem] font-bold tracking-wider text-charcoal/30">ENDED</span>
            )}
          </div>

          <h2 className="text-lg font-black tracking-tighter text-charcoal mb-3">{session.title}</h2>

          <div className="space-y-3 text-xs text-charcoal/60">
            <div>
              <div className="text-[0.55rem] tracking-wider text-charcoal/40 mb-0.5">TIME</div>
              <div className="font-bold text-charcoal">
                {startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                {" – "}
                {endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <div>
              <div className="text-[0.55rem] tracking-wider text-charcoal/40 mb-0.5">ROOM</div>
              <div className="font-bold text-charcoal">{session.room.name}</div>
            </div>
          </div>

          {session.speakers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-charcoal/10">
              <div className="text-[0.55rem] tracking-wider text-charcoal/40 mb-2">SPEAKERS</div>
              <div className="space-y-2">
                {session.speakers.map((speaker) => (
                  <Link
                    key={speaker.id}
                    href={`/speakers/${speaker.id}`}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-6 h-6 bg-charcoal/5 flex items-center justify-center overflow-hidden shrink-0">
                      {speaker.avatar ? (
                        <Image src={speaker.avatar} alt={speaker.name} width={24} height={24} className="object-cover" />
                      ) : (
                        <span className="text-[0.5rem] font-bold text-charcoal/30">{speaker.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-xs text-charcoal/60 group-hover:text-charcoal transition-colors truncate">
                      {speaker.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Q&A Area */}
        <div
          className="flex-1 flex flex-col"
          style={{ height: "calc(100vh - 65px)" }}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal/10 bg-paper shrink-0">
            <div className="flex items-center gap-3">
              {isLive && <div className="w-1.5 h-1.5 bg-nori animate-pulse" />}
              <h3 className="text-sm font-bold tracking-wider text-charcoal">
                {isLive ? "LIVE Q&A" : isUpcoming ? "SESSION NOT STARTED" : "Q&A"}
              </h3>
            </div>
            <span className="text-[0.6rem] text-charcoal/40">
              {questions.length} {questions.length === 1 ? "QUESTION" : "QUESTIONS"}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {isUpcoming ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-8">
                <div className="w-16 h-16 bg-matcha-light rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-matcha">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6V12L16 14" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-charcoal mb-2">Session Not Started</p>
                <p className="text-xs text-charcoal/50 leading-relaxed">
                  Questions will open once the session goes live. Check back at the scheduled time.
                </p>
              </div>
            ) : isEnded && questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-8">
                <p className="text-sm text-charcoal/40">This session has ended.</p>
                <p className="text-xs text-charcoal/30 mt-1">No questions were asked during this session.</p>
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
