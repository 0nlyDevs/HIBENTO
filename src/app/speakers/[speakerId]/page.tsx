"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { fromSpeakerEventSession } from "@/lib/utils/sessionMappers";
import { sortScheduleSessions } from "@/lib/utils/sortSessions";
import { ScheduleTable } from "@/components/sessions/ScheduleTable";
import { TablePagination } from "@/components/ui/TablePagination";
import { keepPreviousData } from "@tanstack/react-query";
import { MessageCircle, ChevronUp, ExternalLink, Search } from "lucide-react";
import { useDeferredValue } from "react";
import type { QuestionDto } from "@/types/dto";

export default function SpeakerProfilePage() {
  const { speakerId } = useParams<{ speakerId: string }>();

  const { data: speaker } = useQuery({
    queryKey: ["speaker", speakerId],
    queryFn: () => api.getSpeaker(speakerId),
    enabled: !!speakerId,
    placeholderData: keepPreviousData,
  });

  const [sessPage, setSessPage] = useState(1);
  const [questionPage, setQuestionPage] = useState(1);
  const [sessSearch, setSessSearch] = useState("");
  const deferredSessSearch = useDeferredValue(sessSearch);
  const [questionSearch, setQuestionSearch] = useState("");
  const deferredQuestionSearch = useDeferredValue(questionSearch);

  const sessionIds = speaker?.eventSessions.map((s) => s.id) ?? [];

  const sessionNameMap = new Map<string, string>();
  speaker?.eventSessions.forEach((s) => sessionNameMap.set(s.id, s.title));

  const { data: questionsBySession } = useQuery({
    queryKey: ["speaker-questions", sessionIds],
    queryFn: async () => {
      const results = await Promise.all(
        sessionIds.map(async (id) => {
          try {
            const res = await api.getQuestions(id);
            return { sessionId: id, sessionTitle: sessionNameMap.get(id) ?? "", questions: res.data as QuestionDto[] };
          } catch {
            return { sessionId: id, sessionTitle: sessionNameMap.get(id) ?? "", questions: [] as QuestionDto[] };
          }
        })
      );
      return results;
    },
    enabled: sessionIds.length > 0,
    placeholderData: keepPreviousData,
  });

  const questionsWithSession = (questionsBySession ?? []).flatMap(
    (q) => q.questions.map((qq) => ({ ...qq, sessionTitle: q.sessionTitle }))
  ).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const searchedQuestions = deferredQuestionSearch
    ? questionsWithSession.filter((qq) =>
        qq.content.toLowerCase().includes(deferredQuestionSearch.toLowerCase()),
      )
    : questionsWithSession;
  const QUESTION_PAGE_SIZE = 5;
  const totalQuestionPages = Math.max(1, Math.ceil(searchedQuestions.length / QUESTION_PAGE_SIZE));
  const safeQuestionPage = Math.min(questionPage, totalQuestionPages);
  const paginatedQuestions = searchedQuestions.slice((safeQuestionPage - 1) * QUESTION_PAGE_SIZE, safeQuestionPage * QUESTION_PAGE_SIZE);

  const sortedSessions = speaker
    ? sortScheduleSessions(speaker.eventSessions.map(fromSpeakerEventSession), "asc")
    : [];
  const searchedSessions = deferredSessSearch
    ? sortedSessions.filter((s) =>
        s.title.toLowerCase().includes(deferredSessSearch.toLowerCase()),
      )
    : sortedSessions;
  const SESSION_PAGE_SIZE = 5;
  const totalSessPages = Math.max(1, Math.ceil(searchedSessions.length / SESSION_PAGE_SIZE));
  const safeSessPage = Math.min(sessPage, totalSessPages);
  const paginatedSessions = searchedSessions.slice((safeSessPage - 1) * SESSION_PAGE_SIZE, safeSessPage * SESSION_PAGE_SIZE);

  return (
    <div className="pt-16 pb-24 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/speakers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ivory/70 hover:text-ivory transition-colors mb-6 group"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:-translate-x-0.5">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          ALL SPEAKERS
        </Link>

        <div className="grid lg:grid-cols-12 gap-8 mb-12 lg:grid-rows-1">
          <div className="lg:col-span-4">
            <div className="card-glass squircle-lg overflow-hidden h-full flex flex-col">
              {speaker ? (
                <>
                  <div className="p-6 pb-4 flex flex-col items-center">
                    <div className="w-36 h-36 rounded-full bg-ivory/5 flex items-center justify-center overflow-hidden mb-3" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                      {speaker!.avatar ? (
                        <Image src={speaker!.avatar} alt={speaker!.name} width={144} height={144} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-5xl font-bold text-ivory/30">{speaker!.name.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-6 text-center">
                    <h1 className="text-display text-[clamp(1.5rem,3vw,2.2rem)] text-ivory leading-tight mb-3">{speaker!.name}</h1>
                    <p className="text-sm text-ivory/70 leading-relaxed">{speaker!.bio || "No bio available"}</p>
                  </div>
                  {speaker!.externalLinks && speaker!.externalLinks.length > 0 && (
                    <div className="px-6 pb-6 space-y-2 mt-auto">
                      <div className="h-px bg-ivory/10 mb-3" />
                      {speaker!.externalLinks.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full px-4 py-2.5 label-mono text-xs text-ivory/70 rounded-lg transition-all hover:text-ivory"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.12)" }}
                        >
                          <span>{link.type.toUpperCase()}</span>
                          <ExternalLink size={11} className="text-ivory/40" />
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-6 flex flex-col items-center animate-pulse">
                  <div className="w-36 h-36 rounded-full bg-white/5 mb-3" />
                  <div className="h-6 w-40 rounded-lg bg-white/5" />
                  <div className="h-4 w-full rounded bg-white/5 mt-4" />
                  <div className="h-4 w-3/4 rounded bg-white/5 mt-2" />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="card-glass squircle-lg p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <MessageCircle size={16} className="text-chartreuse" />
                <span className="label-mono text-ivory/85">QUESTIONS FROM THEIR SESSIONS</span>
                <div className="flex-1 h-px bg-ivory/10" />
                <span className="label-mono text-ivory/40">{searchedQuestions.length}</span>
              </div>
              <div className="mb-4">
                <div className="relative w-full">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40 pointer-events-none" />
                  <input
                    type="text"
                    value={questionSearch}
                    onChange={(e) => { setQuestionSearch(e.target.value); setQuestionPage(1); }}
                    placeholder="Search questions"
                    className="w-full h-9 pl-8 pr-3 text-sm font-medium text-ivory placeholder-ivory/40 focus:outline-none transition-colors rounded-lg"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
              </div>

              {!questionsBySession ? (
                <div className="space-y-3 flex-1 animate-pulse">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="h-3 w-full rounded bg-white/5 mb-2" />
                      <div className="h-3 w-2/3 rounded bg-white/5" />
                    </div>
                  ))}
                </div>
              ) : searchedQuestions.length > 0 ? (
                <div className="space-y-3 pr-1 flex-1">
                  {paginatedQuestions.map((q) => (
                    <div key={q.id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          <ChevronUp size={12} className="text-chartreuse/60" />
                          <span className="text-xs font-bold text-ivory/60">{q.upvotes}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-ivory/85 leading-relaxed">{q.content}</p>
                          <p className="text-[11px] text-ivory/40 mt-1.5">
                            {q.authorName} · in <span className="text-chartreuse/70">{q.sessionTitle}</span> · {new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-ivory/40 text-center py-8">No questions yet from their sessions</p>
                </div>
              )}
              {totalQuestionPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setQuestionPage(Math.max(1, questionPage - 1))}
                    disabled={questionPage === 1}
                    className="px-4 py-2 label-mono text-ivory/70 rounded-full hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-[0.6rem]"
                    style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
                  >
                    PREV
                  </button>
                  <span className="label-mono text-ivory/50 px-2 text-[0.6rem]">
                    {String(questionPage).padStart(2, "0")} / {String(totalQuestionPages).padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => setQuestionPage(Math.min(totalQuestionPages, questionPage + 1))}
                    disabled={questionPage === totalQuestionPages}
                    className="px-4 py-2 label-mono text-ivory/70 rounded-full hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-[0.6rem]"
                    style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
                  >
                    NEXT
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-5">
            <svg className="w-4 h-4 text-chartreuse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span className="label-mono text-ivory/85">SESSIONS</span>
            <div className="flex-1 h-px bg-ivory/10" />
            <span className="label-mono text-ivory/40">{searchedSessions.length} TOTAL</span>
          </div>
          <div
            className="flex items-center gap-3 p-3 mb-6 squircle-lg"
            style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
          >
            <div className="relative w-56 shrink-0">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40 pointer-events-none" />
              <input
                type="text"
                value={sessSearch}
                onChange={(e) => { setSessSearch(e.target.value); setSessPage(1); }}
                placeholder="Search a session"
                className="w-full h-9 pl-8 pr-3 text-sm font-medium text-ivory placeholder-ivory/40 focus:outline-none transition-colors rounded-lg"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
          </div>
          {!speaker ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="squircle-lg p-5 flex items-center gap-4"
                  style={{ background: "#222222E6" }}
                >
                  <div className="h-10 w-10 rounded-lg bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 rounded bg-white/5" />
                    <div className="h-3 w-32 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchedSessions.length > 0 ? (
            <>
              <ScheduleTable
                sessions={paginatedSessions}
                variant="extended"
                sort={false}
                emptyMessage="No sessions found"
              />
              <TablePagination
                page={safeSessPage}
                totalPages={totalSessPages}
                onChange={setSessPage}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
