"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetEventSession } from "@/lib/hooks/useSessions";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";

export default function SessionDetailPage() {
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
      await api.createQuestion(sessionId, questionText, authorName,
      );
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
        <Link href="/events" className="text-sm text-charcoal/60 hover:text-charcoal underline">
          Back to events
        </Link>
      </div>
    );
  }

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
            {session.isLive && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-charcoal/50">
                <span className="w-1.5 h-1.5 bg-nori animate-pulse" />
                STREAMING LIVE
              </div>
            )}
            <Link href="/events" className="text-sm text-charcoal/60 hover:text-charcoal">
              ← BACK
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 65px)" }}>
          <div className="p-6 lg:p-8">
            {/* Session Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                {session.isLive && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold bg-nori text-cream">
                    <span className="w-1 h-1 bg-cream animate-pulse" />
                    LIVE
                  </span>
                )}
                <span className="text-xs tracking-wider text-charcoal/40">{session.room.name}</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-charcoal mb-4">{session.title}</h1>
              <p className="text-base text-charcoal/60 mb-6 leading-relaxed">{session.description}</p>

              <div className="grid grid-cols-3 gap-4 p-4 bg-paper border border-charcoal/10">
                <div>
                  <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">TIME</div>
                  <div className="text-xs font-bold text-charcoal">
                    {new Date(session.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    {" – "}
                    {new Date(session.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div>
                  <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">ROOM</div>
                  <div className="text-xs font-bold text-charcoal">{session.room.name}</div>
                </div>
                <div>
                  <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">CAPACITY</div>
                  <div className="text-xs font-bold text-charcoal">{session.capacity ?? "N/A"}</div>
                </div>
              </div>
            </div>

            {/* Speakers */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 bg-charcoal" />
                <h2 className="text-sm font-bold tracking-wider text-charcoal">SPEAKERS</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {session.speakers.map((speaker) => (
                  <Link
                    key={speaker.id}
                    href={`/speakers/${speaker.id}`}
                    className="flex items-center gap-4 p-4 border border-charcoal/10 bg-rice hover:bg-yellow/5 transition-all group"
                  >
                    <div className="w-12 h-12 bg-charcoal/5 flex items-center justify-center shrink-0 overflow-hidden">
                      {speaker.avatar ? (
                        <Image src={speaker.avatar} alt={speaker.name} width={48} height={48} className="object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-charcoal/20">{speaker.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors text-sm">
                        {speaker.name}
                      </h3>
                      <p className="text-xs text-charcoal/50 line-clamp-2">{speaker.bio}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-[380px] border-l border-charcoal/10 bg-cream flex flex-col shrink-0" style={{ height: "calc(100vh - 65px)" }}>
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal/10 bg-paper">
            <div className="flex items-center gap-3">
              {session.isLive && <div className="w-1.5 h-1.5 bg-nori animate-pulse" />}
              <h3 className="text-sm font-bold tracking-wider text-charcoal">
                {session.isLive ? "LIVE Q&A" : "QUESTIONS"}
              </h3>
            </div>
            <span className="text-[0.6rem] text-charcoal/40">{questions.length} QUESTIONS</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {questions.length > 0 ? (
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
                      onClick={() => console.log("should upvote " + q.id)}
                      className="flex items-center gap-1 mt-1 text-xs text-charcoal/40 hover:text-charcoal transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1L10 6H8V10H4V6H2L6 1Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                      </svg>
                      <span>{q.upvotes}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-sm text-charcoal/40">No questions yet</p>
                {session.isLive && (
                  <p className="text-xs text-charcoal/30 mt-1">Be the first to ask!</p>
                )}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          {session.isLive && (
            <form onSubmit={handleSubmitQuestion} className="border-t border-charcoal/10 p-4 bg-paper">
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