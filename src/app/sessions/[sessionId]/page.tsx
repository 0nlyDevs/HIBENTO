"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { useGetEventSession } from "@/lib/hooks/useSessions";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { SpeakersCell } from "@/components/events/SpeakersCell";
import { VideoPanel } from "@/components/features/SessionPlayer/video-panel";
import { QaPanel } from "@/components/features/SessionPlayer/qa-panel";
import { useUpvote } from "@/hooks/use-upvote";

export default function SessionPlayerPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();

  const {
    data: session,
  } = useGetEventSession(sessionId);

  const isLive = session?.isLive ?? false;

  const { data: questionsData, refetch: refetchQuestions } = useQuery({
    queryKey: ["session-questions", sessionId],
    queryFn: () => api.getQuestions(sessionId),
    refetchInterval: isLive ? 15_000 : undefined,
    enabled: !!session,
  });

  const questions = questionsData?.data ?? session?.questions ?? [];

  const { upvotedQuestions, upvotingQuestions, handleUpvote } = useUpvote(
    sessionId,
    refetchQuestions,
  );

  if (!session) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <header
          className="shrink-0 z-40 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
          style={{ background: "rgba(19, 20, 24, 0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <Link
              href={`/sessions/detail/${sessionId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full label-mono text-xs text-ivory/60 hover:text-ivory hover:bg-white/5 transition-all border border-dashed border-ivory/20 shrink-0"
            >
              <ArrowLeft size={12} />
              BACK
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center border border-dashed border-ivory/15 text-ivory/40"
            >
              <Heart size={15} />
            </div>
          </div>
        </header>
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 animate-pulse">
          <div className="flex-none lg:flex-1 flex items-center justify-center bg-black/40">
            <div className="w-16 h-16 rounded-full bg-white/5" />
          </div>
          <div className="lg:w-[380px] xl:w-[420px] shrink-0 border-l border-white/5 p-4 space-y-3">
            <div className="h-5 w-24 rounded-full bg-white/5" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl space-y-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-3/4 rounded bg-white/5" />
                <div className="h-2 w-24 rounded bg-white/5 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const now = new Date();
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  const isUpcoming = now < startTime;
  const isEnded = now > endTime;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header
        className="shrink-0 z-40 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{
          background: "rgba(19, 20, 24, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/sessions/detail/${sessionId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full label-mono text-xs text-ivory/60 hover:text-ivory hover:bg-white/5 transition-all border border-dashed border-ivory/20 shrink-0"
          >
            <ArrowLeft size={12} />
            BACK
          </Link>
          <div className="h-4 w-px bg-ivory/10 hidden sm:block shrink-0" />
          <span className="font-bold text-sm text-ivory truncate hidden sm:block max-w-75">
            {session.title}
          </span>
          <div className="hidden sm:flex items-center ml-2">
            <SpeakersCell speakers={session.speakers} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              toggleFavorite(session.id);
              toast(
                isFavorite(session.id) ? "Removed from favorites" : "Added to favorites",
                "success",
              );
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all border border-dashed cursor-pointer shrink-0 ${
              isFavorite(session.id)
                ? "bg-chartreuse/15 border-chartreuse/40 text-chartreuse"
                : "border-ivory/15 text-ivory/40 hover:text-chartreuse hover:border-chartreuse/30 hover:bg-chartreuse/5"
            }`}
            aria-label={isFavorite(session.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={15} fill={isFavorite(session.id) ? "currentColor" : "none"} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="flex-none lg:flex-1 lg:flex lg:flex-col">
          <VideoPanel
            isLive={isLive}
            isUpcoming={isUpcoming}
            isEnded={isEnded}
            startTime={startTime}
          />
        </div>

        <QaPanel
          questions={questions}
          isLive={isLive}
          isUpcoming={isUpcoming}
          isEnded={isEnded}
          onUpvote={(questionId) => handleUpvote(questionId, toast)}
          upvotedQuestions={upvotedQuestions}
          upvotingQuestions={upvotingQuestions}
          onSubmitQuestion={async (text, authorName) => {
            await api.createQuestion(sessionId, text, authorName);
            refetchQuestions();
            toast("Question submitted!", "success");
          }}
        />
      </div>
    </div>
  );
}
