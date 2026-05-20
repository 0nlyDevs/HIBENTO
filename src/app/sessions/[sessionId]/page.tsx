"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetEventSession } from "@/lib/hooks/useSessions";
import { useToast } from "@/components/Toast";

const tabs = [
  { id: "info" as const, label: "INFO" },
  { id: "speakers" as const, label: "SPEAKERS" },
  { id: "location" as const, label: "LOCATION" },
];

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { data: session, isLoading } = useGetEventSession(sessionId);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"info" | "speakers" | "location">("info");

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

  const now = new Date();
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  const isUpcoming = now < startTime;
  const isEnded = now > endTime;
  const isLive = session.isLive;
  const isOnline = session.isOnline;

  const handleEnterSession = () => {
    toast("You are now inside the session!", "success");
    router.push(`/sessions/${sessionId}/live`);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-charcoal/10">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="HiBento" width={28} height={28} />
            <span className="font-bold text-xl tracking-tighter text-charcoal">HIBENTO</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm font-bold text-charcoal border-b-2 border-charcoal">
              EVENTS
            </Link>
            <Link href="/speakers" className="text-sm text-charcoal/60 hover:text-charcoal">
              SPEAKERS
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs tracking-wider text-charcoal/40 hover:text-charcoal mb-8"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          BACK TO EVENTS
        </Link>

        {/* Session Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {isLive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold bg-nori text-cream">
                <span className="w-1 h-1 bg-cream animate-pulse" />
                LIVE
              </span>
            )}
            {isUpcoming && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold bg-matcha text-cream">
                UPCOMING
              </span>
            )}
            {isEnded && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold text-charcoal/40 border border-charcoal/20">
                ENDED
              </span>
            )}
            {isOnline && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold bg-indigo text-cream">
                ONLINE
              </span>
            )}
            {!isOnline && session.room && (
              <span className="text-xs tracking-wider text-charcoal/40">{session.room.name}</span>
            )}
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-charcoal mb-4">{session.title}</h1>
          {session.description && (
            <p className="text-base text-charcoal/60 leading-relaxed">{session.description}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-charcoal/10 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-xs tracking-widest font-bold transition-all ${
                activeTab === tab.id
                  ? "text-charcoal border-b-2 border-charcoal"
                  : "text-charcoal/40 hover:text-charcoal/60"
              }`}
            >
              {tab.label}
              {tab.id === "speakers" && ` (${session.speakers.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in min-h-[300px]">
          {/* Info Tab */}
          {activeTab === "info" && (
            <div className="grid grid-cols-2 gap-px bg-charcoal/10">
              <div className="bg-paper p-5">
                <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">DATE</div>
                <div className="text-sm font-bold text-charcoal">
                  {startTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="bg-paper p-5">
                <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">TIME</div>
                <div className="text-sm font-bold text-charcoal">
                  {startTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" – "}
                  {endTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="bg-paper p-5">
                <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">ROOM</div>
                <div className="text-sm font-bold text-charcoal">
                  {session.room?.name ?? (isOnline ? "Online session" : "TBD")}
                </div>
              </div>
              <div className="bg-paper p-5">
                <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">CAPACITY</div>
                <div className="text-sm font-bold text-charcoal">
                  {session.capacity ? `${session.capacity} people` : "N/A"}</div>
              </div>
            </div>
          )}

          {/* Speakers Tab */}
          {activeTab === "speakers" && (
            <div>
              {session.speakers.length === 0 ? (
                <p className="text-sm text-charcoal/40">No speakers assigned to this session.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {session.speakers.map((speaker) => (
                    <Link
                      key={speaker.id}
                      href={`/speakers/${speaker.id}`}
                      className="flex items-center gap-4 p-4 border border-charcoal/10 bg-rice hover:bg-yellow/5 transition-all group"
                    >
                      <div className="w-14 h-14 bg-charcoal/5 flex items-center justify-center shrink-0 overflow-hidden">
                        {speaker.avatar ? (
                          <Image
                            src={speaker.avatar}
                            alt={speaker.name}
                            width={56}
                            height={56}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-charcoal/20">
                            {speaker.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors text-sm">
                          {speaker.name}
                        </h3>
                        {speaker.bio && (
                          <p className="text-xs text-charcoal/50 line-clamp-2 mt-1">{speaker.bio}</p>
                        )}
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-charcoal/20 group-hover:text-charcoal/40 shrink-0"
                      >
                        <path
                          d="M5 3L9 7L5 11"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Location Tab */}
          {activeTab === "location" && (
            <div className="space-y-4">
              {isOnline ? (
                <div className="border border-charcoal/10 bg-paper p-8 flex flex-col items-center justify-center text-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-indigo mb-3"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21H16" strokeLinecap="round" />
                    <path d="M12 17V21" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm font-bold text-charcoal mb-1">Online Session</p>
                  <p className="text-xs text-charcoal/50">
                    This session is held online. No physical location.
                  </p>
                </div>
              ) : (
                <>
                  <div className="border border-charcoal/10 bg-paper p-5">
                    <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">ROOM</div>
                    <div className="text-sm font-bold text-charcoal">{session.room?.name ?? "TBD"}</div>
                    {session.room?.capacity && (
                      <div className="text-xs text-charcoal/40 mt-1">
                        Capacity: {session.room.capacity} people
                      </div>
                    )}
                  </div>

                  {session.venue && (
                    <div className="border border-charcoal/10 bg-paper p-5">
                      <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">VENUE</div>
                      <div className="text-sm font-bold text-charcoal">{session.venue.name}</div>
                      <div className="text-xs text-charcoal/50 mt-1">
                        {session.venue.neighborhood}, {session.venue.city}
                      </div>
                    </div>
                  )}

                  {/* Map Placeholder */}
                  <div className="w-full h-56 bg-paper border border-charcoal/10 flex items-center justify-center">
                    <div className="text-center text-charcoal/40">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="mx-auto mb-3"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <p className="text-sm font-medium">Map Placeholder</p>
                      <p className="text-xs mt-1">
                        {session.venue
                          ? `${session.venue.name} – ${session.venue.city}`
                          : session.room?.name ?? "Location TBD"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="mt-10 pt-8 border-t border-charcoal/10">
          {isLive || isUpcoming ? (
            <button onClick={handleEnterSession} className="btn-primary">
              {isLive ? "ENTER SESSION" : "JOIN SESSION"}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-charcoal/40">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" />
                <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              This session has ended
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
