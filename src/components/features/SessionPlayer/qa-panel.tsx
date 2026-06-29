"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowUp, Clock, Send, AlertTriangle } from "lucide-react";
import type { QuestionDto } from "@/types/dto";
import { api } from "@/lib/api";

interface QaPanelProps {
  questions: QuestionDto[];
  sessionId: string;
  isLive: boolean;
  isUpcoming: boolean;
  isEnded: boolean;
  onUpvote: (questionId: string) => void;
  upvotedQuestions: Set<string>;
  upvotingQuestions: Set<string>;
  onSubmitQuestion: (text: string, authorName: string) => Promise<void>;
}

function QuestionCard({
  question,
  hasUpvoted,
  isUpvoting,
  onUpvote,
}: {
  question: QuestionDto;
  hasUpvoted: boolean;
  isUpvoting: boolean;
  onUpvote: () => void;
}) {
  return (
    <div className="card-glass p-3.5 rounded-xl flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-bold text-ivory/60 ring-1 ring-white/10 shrink-0">
          {question.authorName.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-semibold text-ivory/70 truncate max-w-37.5">
          {question.authorName}
        </span>
        <span className="text-[9px] font-mono text-ivory/30 ml-auto">
          {new Date(question.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <p className="text-xs text-ivory/85 leading-relaxed">{question.content}</p>
      <div className="flex items-center gap-3 pt-1 border-t border-white/5">
        <button
          onClick={onUpvote}
          disabled={isUpvoting}
          className={`flex items-center gap-1.5 text-[10px] tracking-wider font-semibold transition-all cursor-pointer ${
            hasUpvoted ? "text-chartreuse" : "text-ivory/40 hover:text-ivory/70"
          }`}
        >
          <ArrowUp
            size={12}
            className={`transition-transform duration-200 ${hasUpvoted ? "scale-110" : ""}`}
            fill={hasUpvoted ? "currentColor" : "none"}
          />
          <span>{question.upvotes} UPVOTE{question.upvotes === 1 ? "" : "S"}</span>
        </button>
      </div>
    </div>
  );
}

export function QaPanel({
  questions,
  sessionId,
  isLive,
  isUpcoming,
  isEnded,
  onUpvote,
  upvotedQuestions,
  upvotingQuestions,
  onSubmitQuestion,
}: QaPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [questionText, setQuestionText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    similarQuestion: QuestionDto;
    similarity: number;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questions.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    if (duplicateWarning) {
      setDuplicateWarning(null);
      setIsSubmitting(true);
      try {
        await onSubmitQuestion(questionText, authorName);
        setQuestionText("");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsChecking(true);
    try {
      const result = await api.checkDuplicateQuestion(sessionId, questionText);
      if (result.data.isDuplicate && result.data.similarQuestion) {
        setDuplicateWarning({
          similarQuestion: result.data.similarQuestion,
          similarity: result.data.similarity,
        });
        return;
      }
    } catch {
      // If the check fails, submit anyway
    } finally {
      setIsChecking(false);
    }

    setIsSubmitting(true);
    try {
      await onSubmitQuestion(questionText, authorName);
      setQuestionText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (value: string) => {
    setQuestionText(value);
    if (duplicateWarning) setDuplicateWarning(null);
  };

  const isEmptyQuestions = questions.length === 0;

  return (
    <div
      className="flex-1 min-h-0 lg:flex-none lg:w-95 flex flex-col overflow-hidden lg:sticky lg:top-14.25 lg:max-h-[calc(100vh-57px)]"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-chartreuse rounded-full" />
          <h3 className="label-mono text-xs font-bold text-ivory/80">Q&A</h3>
        </div>
        <span className="label-mono text-[10px] text-ivory/45 bg-white/5 px-2 py-0.5 rounded">
          {questions.length} ASKED
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
        {(() => {
          if (isUpcoming) {
            return (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 text-ivory/40 gap-2">
                <Clock size={20} className="text-chartreuse/40" />
                <p className="text-xs font-medium">Questions Not Open Yet</p>
                <p className="text-[10px] text-ivory/30">
                  Questions will unlock when this session is live.
                </p>
              </div>
            );
          }
          if (!isEmptyQuestions) {
            return questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                hasUpvoted={upvotedQuestions.has(q.id)}
                isUpvoting={upvotingQuestions.has(q.id)}
                onUpvote={() => onUpvote(q.id)}
              />
            ));
          }
          if (isEnded) {
            return (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 text-ivory/30">
                <p className="text-xs font-medium">Session Ended</p>
                <p className="text-[10px] text-ivory/20 mt-0.5">No questions were asked.</p>
              </div>
            );
          }
          return (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 text-ivory/40">
              <p className="text-xs font-medium">No Questions Yet</p>
              <p className="text-[10px] text-ivory/30 mt-0.5">
                Stream is active — ask your questions below!
              </p>
            </div>
          );
        })()}
        <div ref={chatEndRef} />
      </div>

      {isLive && (
        <form onSubmit={handleSubmit} className="border-t border-white/5 p-4 shrink-0 bg-black/20">
          {duplicateWarning && (
            <div className="mb-3 p-3 rounded-lg" style={{ background: "rgba(200,210,50,0.08)", border: "1px solid rgba(200,210,50,0.25)" }}>
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle size={14} className="text-chartreuse shrink-0 mt-0.5" />
                <p className="text-[10px] font-semibold text-chartreuse label-mono">
                  SIMILAR QUESTION EXISTS
                </p>
              </div>
              <p className="text-[11px] text-ivory/70 mb-2 leading-relaxed">
                {'\u201C'}{duplicateWarning.similarQuestion.content}{'\u201D'}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-ivory/40">
                  {Math.round(duplicateWarning.similarity * 100)}% similar
                </span>
                <div className="ml-auto flex items-center">
                  {upvotedQuestions.has(duplicateWarning.similarQuestion.id) ? (
                    <span className="text-[10px] text-ivory/40">Already upvoted</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onUpvote(duplicateWarning.similarQuestion.id);
                        setDuplicateWarning(null);
                      }}
                      disabled={upvotingQuestions.has(duplicateWarning.similarQuestion.id)}
                      className="flex items-center gap-1 text-[10px] label-mono font-semibold text-chartreuse/80 hover:text-chartreuse transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <ArrowUp size={12} />
                      Upvote
                      {duplicateWarning.similarQuestion.upvotes > 0 && (
                        <span className="text-ivory/50">({duplicateWarning.similarQuestion.upvotes})</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={questionText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 text-xs bg-white/5 border border-white/10 text-ivory/80 placeholder-ivory/30 focus:outline-none focus:border-chartreuse/40 rounded-lg"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting || isChecking || !questionText.trim()}
              className="px-3.5 py-2 label-mono text-xs font-bold text-charcoal shrink-0 rounded-lg transition-all disabled:opacity-40 cursor-pointer hover:brightness-110 active:scale-95"
              style={{ background: "hsl(59 73% 52%)" }}
            >
              {isChecking ? (
                <span className="text-[10px]">...</span>
              ) : (
                <Send size={12} />
              )}
            </button>
          </div>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your display name (optional)"
            className="w-full px-1 py-1.5 text-[10px] border-b border-white/10 bg-transparent text-ivory/50 placeholder-ivory/25 focus:outline-none focus:border-chartreuse/20"
          />
        </form>
      )}
    </div>
  );
}
