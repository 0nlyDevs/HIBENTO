"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils/dates";

export default function SpeakerProfilePage() {
  const { speakerId } = useParams<{ speakerId: string }>();

  const { data: speaker, isLoading } = useQuery({
    queryKey: ["speaker", speakerId],
    queryFn: () => api.getSpeaker(speakerId),
    enabled: !!speakerId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-charcoal border-t-yellow animate-spin" />
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-charcoal">SPEAKER NOT FOUND</h1>
        <Link href="/speakers" className="text-sm text-charcoal/60 hover:text-charcoal underline">
          Back to speakers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/speakers" className="inline-flex items-center gap-2 text-xs tracking-wider text-charcoal/40 hover:text-charcoal mb-8">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          ALL SPEAKERS
        </Link>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Links */}
          <div className="md:col-span-1">
            <div className="w-full aspect-square bg-charcoal/5 mb-6 flex items-center justify-center overflow-hidden">
              {speaker.avatar ? (
                <Image
                  src={speaker.avatar}
                  alt={speaker.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-6xl font-bold text-charcoal/20">
                  {speaker.name.charAt(0)}
                </span>
              )}
            </div>

            {speaker.externalLinks && speaker.externalLinks.length > 0 && (
              <div className="space-y-2">
                <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-3">CONNECT</div>
                {speaker.externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 text-center text-xs tracking-wider border border-charcoal/20 hover:bg-yellow/10 transition-colors"
                  >
                    {link.type.toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Info & Sessions */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tighter text-charcoal mb-4">
                {speaker.name}
              </h1>
              <p className="text-base text-charcoal/60 leading-relaxed">
                {speaker.bio || "No bio available"}
              </p>
            </div>

            {speaker.eventSessions && speaker.eventSessions.length > 0 && (
              <div className="border-t border-charcoal/10 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 bg-yellow" />
                  <h2 className="text-sm font-bold tracking-wider text-charcoal">SESSIONS</h2>
                  <span className="text-[0.6rem] text-charcoal/40 ml-auto">
                    {speaker.eventSessions.length} TOTAL
                  </span>
                </div>

                <div className="space-y-3">
                  {speaker.eventSessions.map((session) => {
                    const start = new Date(session.startTime);
                    const end = new Date(session.endTime);
                    const now = new Date();
                    const isPast = end < now;
                    const isUpcoming = start > now;
                    return (
                      <Link
                        key={session.id}
                        href={`/sessions/${session.id}`}
                        className={`block p-4 border transition-all group ${
                          session.isLive
                            ? "border-yellow bg-yellow/5 hover:bg-yellow/10 ring-1 ring-yellow"
                            : "border-charcoal/10 hover:bg-yellow/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              {session.isLive && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[0.6rem] font-bold bg-nori text-cream">
                                  <span className="w-1 h-1 bg-cream animate-pulse" />
                                  LIVE
                                </span>
                              )}
                              {isUpcoming && !session.isLive && (
                                <span className="text-[0.6rem] tracking-wider font-bold text-matcha">UPCOMING</span>
                              )}
                              {isPast && !session.isLive && (
                                <span className="text-[0.6rem] tracking-wider font-bold text-charcoal/30">ENDED</span>
                              )}
                              <span className="text-xs font-mono text-charcoal/40">
                                {formatDate(start)}
                                {" · "}
                                {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                {" – "}
                                {end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <h3 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors mb-1">
                              {session.title}
                            </h3>
                            {session.description && (
                              <p className="text-xs text-charcoal/50 line-clamp-2 mb-2">
                                {session.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-charcoal/40">
                              <span className="font-medium text-charcoal/60">{session.eventName}</span>
                              <span>·</span>
                              <span>{session.room}</span>
                              {session.neighborhood && (
                                <>
                                  <span>·</span>
                                  <span>{session.neighborhood}</span>
                                </>
                              )}
                            </div>
                            {session.speakers.length > 0 && (
                              <div className="flex items-center gap-1.5 mt-2 text-xs text-charcoal/40">
                                <span>With</span>
                                {session.speakers.map((s, i) => (
                                  <span key={s.id}>
                                    <Link href={`/speakers/${s.id}`} className="text-charcoal/60 hover:text-yellow-dark underline underline-offset-2">
                                      {s.name}
                                    </Link>
                                    {i < session.speakers.length - 1 && ","}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-charcoal/20 group-hover:text-charcoal transition-colors shrink-0 mt-1">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}