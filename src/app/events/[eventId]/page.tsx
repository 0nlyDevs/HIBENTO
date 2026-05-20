"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetEvent } from "@/lib/hooks/useEvents";
import { SessionCard } from "@/components/sessions/SessionCard";
import { formatDate, formatDateRange } from "@/lib/utils/dates";

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isLoading } = useGetEvent(eventId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-charcoal/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-charcoal/40 text-sm tracking-wider">EVENT NOT FOUND</p>
      </div>
    );
  }

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const now = new Date();
  const isLive = start <= now && end >= now;
  const isOnline = event.isOnline;

  const onlineSessions = event.eventSessions.filter((s) => s.isOnline);
  const onsiteSessions = event.eventSessions.filter((s) => !s.isOnline);

  const sessionsByRoom = onsiteSessions.reduce<Record<string, typeof onsiteSessions>>(
    (acc, s) => {
      const name = s.room?.name ?? "Unknown";
      if (!acc[name]) acc[name] = [];
      acc[name].push(s);
      return acc;
    },
    {}
  );

  const allSpeakers = new Map<string, { id: string; name: string; avatar: string | null; bio: string | null }>();
  for (const session of event.eventSessions) {
    for (const speaker of session.speakers) {
      if (!allSpeakers.has(speaker.id)) {
        allSpeakers.set(speaker.id, speaker);
      }
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back link */}
        <Link href="/events" className="inline-flex items-center gap-2 text-xs tracking-wider text-charcoal/40 hover:text-charcoal mb-8">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          BACK TO EVENTS
        </Link>

        {/* Event Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            {isOnline && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold bg-charcoal text-cream">
                ONLINE
              </span>
            )}
            {!isOnline && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold bg-paper text-charcoal border border-charcoal/20">
                ONSITE
              </span>
            )}
            {isLive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold bg-nori text-cream">
                ONGOING
              </span>
            )}
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-charcoal mb-4">{event.title}</h1>
          {event.description && (
            <p className="text-base text-charcoal/60 leading-relaxed mb-6">{event.description}</p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-4 gap-4 p-5 bg-paper border border-charcoal/10">
            <div>
              <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">DATES</div>
              <div className="text-xs font-bold text-charcoal">
                {formatDateRange(start, end)}
              </div>
            </div>
            <div>
              <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">TIME</div>
              <div className="text-xs font-bold text-charcoal">
                {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                {" – "}
                {end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <div>
              <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">LOCATION</div>
              {event.venue ? (
                <>
                  <div className="text-xs font-bold text-charcoal">{event.venue.city}</div>
                  <div className="text-[0.6rem] text-charcoal/40">{event.venue.neighborhood}</div>
                </>
              ) : (
                <div className="text-xs font-bold text-indigo">ONLINE EVENT</div>
              )}
            </div>
            <div>
              <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">VENUE</div>
              {event.venue ? (
                <>
                  <div className="text-xs font-bold text-charcoal">{event.venue.name}</div>
                  <div className="text-[0.6rem] text-charcoal/40">{event.venue.totalRooms} ROOMS</div>
                </>
              ) : (
                <div className="text-xs text-charcoal/40">No physical venue</div>
              )}
            </div>
          </div>

          {/* Online attendance note for onsite events */}
          {!isOnline && (
            <div className="mt-4 flex items-center gap-2 text-xs text-matcha bg-matcha-light/50 p-3 border border-matcha/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21H16" strokeLinecap="round" />
                <path d="M12 17V21" strokeLinecap="round" />
              </svg>
              <span>
                This event is <strong>onsite</strong>. You can also attend sessions online via the HiBento app.
              </span>
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-yellow" />
            <h2 className="text-sm font-bold tracking-widest text-charcoal">SCHEDULE</h2>
            <span className="text-[0.6rem] tracking-wider text-charcoal/30 ml-auto">
              {event.eventSessions.length} SESSIONS
            </span>
          </div>

          <div className="space-y-8">
            {/* Online sessions */}
            {onlineSessions.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1.5 h-1.5 bg-indigo" />
                  <h3 className="text-xs font-bold tracking-wider text-indigo">ONLINE</h3>
                  <div className="flex-1 h-px bg-charcoal/5" />
                  <span className="text-[0.6rem] text-charcoal/30">{onlineSessions.length} SESSIONS</span>
                </div>
                <div className="space-y-2">
                  {onlineSessions
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                </div>
              </div>
            )}

            {/* Onsite sessions grouped by room */}
            {Object.entries(sessionsByRoom).map(([roomName, sessions]) => (
              <div key={roomName}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1.5 h-1.5 bg-charcoal/30" />
                  <h3 className="text-xs font-bold tracking-wider text-charcoal/60">{roomName.toUpperCase()}</h3>
                  <div className="flex-1 h-px bg-charcoal/5" />
                  <span className="text-[0.6rem] text-charcoal/30">{sessions.length} SESSIONS</span>
                </div>
                <div className="space-y-2">
                  {sessions
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                </div>
              </div>
            ))}

            {event.eventSessions.length === 0 && (
              <div className="text-center py-8 border border-dashed border-charcoal/10">
                <p className="text-xs text-charcoal/40">No sessions scheduled yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Speakers */}
        {allSpeakers.size > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 bg-charcoal" />
              <h2 className="text-sm font-bold tracking-widest text-charcoal">SPEAKERS</h2>
              <span className="text-[0.6rem] tracking-wider text-charcoal/30 ml-auto">
                {allSpeakers.size} {allSpeakers.size === 1 ? "SPEAKER" : "SPEAKERS"}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(allSpeakers.values()).map((speaker) => (
                <Link
                  key={speaker.id}
                  href={`/speakers/${speaker.id}`}
                  className="flex items-center gap-4 p-4 border border-charcoal/10 bg-rice hover:bg-yellow/5 transition-all group"
                >
                  <div className="w-12 h-12 bg-charcoal/5 flex items-center justify-center shrink-0 overflow-hidden">
                    {speaker.avatar ? (
                      <Image src={speaker.avatar} alt={speaker.name} width={48} height={48} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-lg font-bold text-charcoal/20">{speaker.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors text-sm">
                      {speaker.name}
                    </h3>
                    {speaker.bio && (
                      <p className="text-xs text-charcoal/50 line-clamp-1">{speaker.bio}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
