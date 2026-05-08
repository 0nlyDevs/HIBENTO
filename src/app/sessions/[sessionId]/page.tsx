"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetSession } from "@/lib/hooks/useSessions";

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: session, isLoading } = useGetSession(sessionId);
  const [questionText, setQuestionText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: questionText,
          authorName: authorName || 'Anonymous'
        })
      });

      if (response.ok) {
        setQuestionText("");
        setAuthorName("");
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to submit question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (questionId: string) => {
    try {
      await fetch(`/api/questions/${questionId}/upvote`, { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-charcoal border-t-yellow animate-spin mx-auto mb-4"></div>
          <p className="text-sm tracking-wider text-charcoal/60">LOADING</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">SESSION NOT FOUND</h1>
          <Link href="/events" className="btn-primary">BACK TO EVENTS</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-charcoal/10 bg-cream/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.svg"
              alt="HIBENTO"
              width={28}
              height={28}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-xl tracking-tighter text-charcoal">
              HIBENTO
            </span>
          </Link>
          <Link href="/events" className="btn-outline text-xs py-2 px-4">
            {'\u2190'} BACK
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            {session.isLive && <span className="live-badge">LIVE</span>}
            <span className="text-xs tracking-wider text-charcoal/50">
              {session.room}
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tighter text-charcoal mb-4">
            {session.title}
          </h1>

          <p className="text-lg text-charcoal/60 mb-6 leading-relaxed">
            {session.description}
          </p>

          <div className="grid grid-cols-3 gap-6 p-6 bg-paper border border-charcoal/10">
            <div>
              <div className="text-xs tracking-wider text-charcoal/40 mb-1">TIME</div>
              <div className="text-sm font-bold text-charcoal">
                {new Date(session.startTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {' \u2014 '}
                {new Date(session.endTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div>
              <div className="text-xs tracking-wider text-charcoal/40 mb-1">ROOM</div>
              <div className="text-sm font-bold text-charcoal">{session.room}</div>
            </div>
            <div>
              <div className="text-xs tracking-wider text-charcoal/40 mb-1">CAPACITY</div>
              <div className="text-sm font-bold text-charcoal">
                {session.capacity ?? 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-charcoal"></div>
            <h2 className="text-lg font-bold tracking-wider text-charcoal">
              SPEAKERS
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {session.speakers.map((speaker) => (
              <Link
                key={speaker.id}
                href={`/speakers/${speaker.id}`}
                className="bento-card flex items-center gap-4 group"
              >
                <div className="w-16 h-16 bg-charcoal/5 flex items-center justify-center shrink-0">
                  {speaker.avatar ? (
                    <Image
                      src={speaker.avatar}
                      alt={speaker.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-charcoal/20">
                      {speaker.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="text-sm text-charcoal/60 line-clamp-2">
                    {speaker.bio}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {session.isLive && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-nori animate-pulse"></div>
              <h2 className="text-lg font-bold tracking-wider text-charcoal">
                QUESTIONS &amp; ANSWERS
              </h2>
            </div>

            <form onSubmit={handleSubmitQuestion} className="bento-card mb-8">
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ask a question..."
                className="input-field mb-4 min-h-[100px] resize-none"
                required
              />
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="input-field"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !questionText.trim()}
                  className="btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                </button>
              </div>
            </form>

            {session.questions && session.questions.length > 0 ? (
              <div className="space-y-4">
                {[...session.questions]
                  .sort((a, b) => b.upvotes - a.upvotes)
                  .map((question) => (
                    <div key={question.id} className="bento-card flex items-start gap-4">
                      <button
                        onClick={() => handleUpvote(question.id)}
                        className="flex flex-col items-center gap-1 group hover:text-yellow-dark transition-colors cursor-pointer"
                      >
                        <span className="text-xl leading-none">{'\u25B2'}</span>
                        <span className="text-xs font-bold text-charcoal/60 group-hover:text-charcoal">
                          {question.upvotes}
                        </span>
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-charcoal mb-2">
                          {question.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-charcoal/40">
                          <span>{question.authorName}</span>
                          <span>&middot;</span>
                          <span>
                            {new Date(question.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="bento-card text-center py-12">
                <p className="text-sm text-charcoal/40 tracking-wider">
                  NO QUESTIONS YET. BE THE FIRST TO ASK.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
