"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetSession } from "@/lib/hooks/useSessions";
import { useToast } from "@/components/Toast";
import { VideoPlayer } from "@/components/VideoPlayer";

const EMOJIS = ["\uD83D\uDC4D", "\uD83D\uDE0A", "\uD83D\uDE4C", "\uD83D\uDC4F", "\uD83D\uDE80", "\u2764\uFE0F"];

function ParticipantBadge({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-charcoal/50 tracking-wider">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-charcoal/30">
        <path d="M7 8C8.5 8 10 9 10 11H4C4 9 5.5 8 7 8Z" fill="currentColor"/>
        <circle cx="7" cy="4.5" r="2.5" fill="currentColor"/>
      </svg>
      {count} VIEWING
    </div>
  );
}

function SessionHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="skeleton h-4 w-24 mb-3"></div>
      <div className="skeleton h-10 w-3/4 mb-4"></div>
      <div className="skeleton h-5 w-full mb-2"></div>
      <div className="skeleton h-5 w-2/3 mb-6"></div>
      <div className="grid grid-cols-3 gap-6 p-6 bg-paper">
        <div className="skeleton h-10"></div>
        <div className="skeleton h-10"></div>
        <div className="skeleton h-10"></div>
      </div>
    </div>
  );
}

function ChatMessage({
  question,
  isSpeaker,
  onUpvote,
}: {
  question: { id: string; content: string; authorName: string; upvotes: number; createdAt: string };
  isSpeaker: boolean;
  onUpvote: (id: string) => void;
}) {
  const [reacted, setReacted] = useState(false);

  return (
    <div className={`flex ${isSpeaker ? "justify-start" : "justify-start"} mb-4 animate-slide-up`}>
      <div className="max-w-[85%]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className={`w-6 h-6 flex items-center justify-center text-[0.625rem] font-bold ${
            isSpeaker ? "bg-matcha text-cream" : "bg-charcoal/10 text-charcoal"
          }`}>
            {isSpeaker ? "S" : question.authorName.charAt(0).toUpperCase()}
          </div>
          <span className={`text-xs font-medium ${isSpeaker ? "text-matcha" : "text-charcoal/60"}`}>
            {question.authorName}
            {isSpeaker && <span className="ml-1.5 text-[0.625rem] tracking-wider font-bold">SPEAKER</span>}
          </span>
          <span className="text-[0.625rem] text-charcoal/30">
            {new Date(question.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div className={`chat-bubble ${isSpeaker ? "chat-bubble--speaker" : "chat-bubble--attendee"}`}>
          <p className="text-sm leading-relaxed">{question.content}</p>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <button
            onClick={() => onUpvote(question.id)}
            className="flex items-center gap-1 text-xs text-charcoal/40 hover:text-charcoal transition-colors group"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:scale-110 transition-transform">
              <path d="M7 1L13 8H9V13H5V8H1L7 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">{question.upvotes}</span>
          </button>
          <div className="flex gap-0.5">
            {EMOJIS.slice(0, 3).map((emoji) => (
              <button
                key={emoji}
                onClick={() => setReacted(!reacted)}
                className="reaction-btn !w-6 !h-6 !text-[0.75rem]"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveChatSidebar({
  session,
  sessionId,
}: {
  session: { questions?: Array<{ id: string; content: string; authorName: string; upvotes: number; createdAt: string }>; speakers: Array<{ id: string; name: string }> };
  sessionId: string;
}) {
  const [questionText, setQuestionText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participantCount] = useState(() => Math.floor(Math.random() * 80) + 20);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const questions = session.questions || [];
  const speakerIds = new Set(session.speakers.map((s) => s.name));

  const sortedQuestions = [...questions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questions.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: questionText, authorName: authorName || "Anonymous" }),
      });
      if (res.ok) {
        setQuestionText("");
        setAuthorName("");
        toast("Question submitted!", "success");
      } else {
        const body = await res.json();
        toast(body?.error || "Failed to submit", "error");
      }
    } catch {
      toast("Network error", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (qId: string) => {
    try {
      if (questions.find((q) => q.id === qId)) {
        toast("Upvoted!", "success");
      }
      await fetch(`/api/questions/${qId}/upvote`, { method: "POST" });
    } catch {
      // silent
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal/10 bg-paper">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-nori animate-pulse"></div>
          <h3 className="text-sm font-bold tracking-wider text-charcoal">LIVE CHAT</h3>
        </div>
        <ParticipantBadge count={participantCount} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1" style={{ maxHeight: "calc(100vh - 320px)" }}>
        {sortedQuestions.length > 0 ? (
          sortedQuestions.map((q) => (
            <ChatMessage
              key={q.id}
              question={q}
              isSpeaker={speakerIds.has(q.authorName)}
              onUpvote={handleUpvote}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 bg-yellow/20 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-dark">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <p className="text-sm text-charcoal/40 font-medium tracking-wider">NO MESSAGES YET</p>
            <p className="text-xs text-charcoal/30 mt-1">Be the first to ask a question</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-bar">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Ask a question..."
              className="input-field pr-10"
              required
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5">
              {EMOJIS.slice(0, 3).map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setQuestionText((prev) => prev + emoji)}
                  className="reaction-btn !w-6 !h-6 !text-[0.7rem]"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !questionText.trim()}
            className="btn-primary btn-sm disabled:opacity-50 shrink-0"
          >
            {isSubmitting ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="30 10"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8L14 2L9 14L7 9L2 8Z" fill="currentColor"/>
              </svg>
            )}
            <span className="hidden sm:inline">{isSubmitting ? "SENDING" : "SEND"}</span>
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name (optional)"
            className="text-xs bg-transparent border-b border-charcoal/10 text-charcoal/50 focus:border-charcoal/30 focus:outline-none py-0.5 w-36"
          />
          <div className="flex gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setQuestionText((prev) => prev + emoji)}
                className="reaction-btn !w-5 !h-5 !text-[0.6rem] hover:scale-110"
                title="Add reaction"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: session, isLoading } = useGetSession(sessionId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream relative overflow-hidden">
        <nav className="border-b border-charcoal/10 bg-cream/95 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.svg" alt="HIBENTO" width={28} height={28} />
              <span className="font-bold text-xl tracking-tighter text-charcoal">HIBENTO</span>
            </Link>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <SessionHeaderSkeleton />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">SESSION NOT FOUND</h1>
          <Link href="/events" className="btn-primary">BACK TO EVENTS</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col relative overflow-hidden">
      <nav className="border-b border-charcoal/10 bg-cream/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.svg" alt="HIBENTO" width={28} height={28} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl tracking-tighter text-charcoal">HIBENTO</span>
          </Link>
          <div className="flex items-center gap-4">
            {session.isLive && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-charcoal/50 tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nori opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-nori"></span>
                </span>
                STREAMING LIVE
              </div>
            )}
            <Link href="/events" className="btn-outline text-xs py-2 px-4">
              ← BACK
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex">
        {/* Main Content - Left Side */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 65px)" }}>
          <div className="p-6 lg:p-8">
            {/* Session Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                {session.isLive && <span className="live-badge">LIVE</span>}
                <span className="text-xs tracking-wider text-charcoal/50">{session.room}</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-charcoal mb-4">{session.title}</h1>
              <p className="text-base text-charcoal/60 mb-6 leading-relaxed">{session.description}</p>

              <div className="grid grid-cols-3 gap-4 p-4 bg-paper border border-charcoal/10">
                <div>
                  <div className="text-xs tracking-wider text-charcoal/40 mb-1">TIME</div>
                  <div className="text-xs font-bold text-charcoal">
                    {new Date(session.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    {" — "}
                    {new Date(session.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div>
                  <div className="text-xs tracking-wider text-charcoal/40 mb-1">ROOM</div>
                  <div className="text-xs font-bold text-charcoal">{session.room}</div>
                </div>
                <div>
                  <div className="text-xs tracking-wider text-charcoal/40 mb-1">CAPACITY</div>
                  <div className="text-xs font-bold text-charcoal">{session.capacity ?? "N/A"}</div>
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${session.isLive ? 'bg-nori animate-pulse' : 'bg-charcoal/30'}`}></div>
                  <h2 className="text-lg font-bold tracking-wider text-charcoal">
                    {session.isLive ? 'LIVE STREAM' : 'SESSION STREAM'}
                  </h2>
                </div>
                <ParticipantBadge count={Math.floor(Math.random() * 80) + 20} />
              </div>
              <VideoPlayer mode={session.isLive ? "live" : "recorded"} />
            </div>

            {/* Speakers */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-charcoal"></div>
                <h2 className="text-lg font-bold tracking-wider text-charcoal">SPEAKERS</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {session.speakers.map((speaker) => (
                  <Link
                    key={speaker.id}
                    href={`/speakers/${speaker.id}`}
                    className="flex items-center gap-4 p-4 border border-charcoal/10 bg-rice group hover:bg-yellow/5 transition-all"
                  >
                    <div className="w-14 h-14 bg-charcoal/5 flex items-center justify-center shrink-0">
                      {speaker.avatar ? (
                        <Image src={speaker.avatar} alt={speaker.name} width={56} height={56} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-xl font-bold text-charcoal/20">{speaker.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors">{speaker.name}</h3>
                      <p className="text-xs text-charcoal/50 line-clamp-2">{speaker.bio}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar - Always Visible on the Right */}
        <div className="w-[380px] lg:w-[420px] border-l border-charcoal/10 bg-cream flex flex-col shrink-0" style={{ height: "calc(100vh - 65px)" }}>
          <LiveChatSidebar session={session} sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
}
