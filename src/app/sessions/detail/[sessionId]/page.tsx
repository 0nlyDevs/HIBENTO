"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGetEventSession } from "@/lib/hooks/useSessions";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useToast } from "@/components/ui/Toast";
import { SessionBadges } from "@/components/ui/SessionBadges";
import { SpeakerCard } from "@/components/ui/SpeakerCard";
import { VenueCard } from "@/components/ui/VenueCard";
import { ROUTES } from "@/constants/routes";
import { formatTime, formatFullDate } from "@/lib/utils/dates";
import { getSessionStatus } from "@/lib/utils/session-status";
import {
  Heart, Play, Clock, MapPin, Calendar, Users,
} from "lucide-react";

function InfoCardSkeleton() {
  return (
    <div className="rounded-xl p-4 space-y-2 motion-safe:animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }}>
      <div className="h-3 w-20 rounded-full bg-ivory/5" />
      <div className="h-4 w-28 rounded-lg bg-ivory/5" />
      <div className="h-3 w-20 rounded-lg bg-ivory/5" />
    </div>
  );
}

function InfoCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-1.5 transition-all hover:-translate-y-0.5"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-chartreuse/10">{icon}</div>
        <span className="label-mono text-ivory/40 text-[0.6rem]">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { data: session, isLoading } = useGetEventSession(sessionId);

  if (!isLoading && !session) {
    return (
      <div className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ivory/70 hover:text-ivory transition-colors mb-6 group cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:-translate-x-0.5">
              <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            SESSION NOT FOUND
          </button>
        </div>
      </div>
    );
  }

  const startTime = session ? new Date(session.startTime) : new Date();
  const endTime = session ? new Date(session.endTime) : new Date();
  const status = session ? getSessionStatus(session) : { isLive: false, isUpcoming: false, isEnded: true };
  const isOnline = session?.isOnline ?? false;
  const favorited = session ? isFavorite(session.id) : false;

  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => {
            if (session) router.push(ROUTES.EVENT_DETAIL(session.eventId));
            else router.back();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ivory/70 hover:text-ivory transition-colors mb-6 group cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:-translate-x-0.5">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          BACK
        </button>

        <div className="w-full squircle-lg overflow-hidden" style={{ background: "#131418", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className={`h-1 w-full ${session ? "bg-chartreuse" : "bg-ivory/5"} shrink-0 rounded-t-[1rem] transition-colors duration-500`} />

          <div className="px-7 py-6">
            <div className="mb-7">
              {session ? (
                <SessionBadges
                  isLive={status.isLive}
                  isUpcoming={status.isUpcoming}
                  isEnded={status.isEnded}
                  isOnline={isOnline}
                  roomName={session.room?.name}
                />
              ) : (
                <div className="flex items-center gap-2 mb-4 flex-wrap" aria-hidden="true">
                  <div className="h-6 w-16 rounded-full bg-ivory/5 motion-safe:animate-pulse" />
                  <div className="h-6 w-20 rounded-full bg-ivory/5 motion-safe:animate-pulse" />
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {session ? (
                    <>
                      <h1 className="text-display text-[clamp(1.5rem,3.5vw,2.2rem)] text-ivory leading-tight mb-3">
                        {session.title}
                      </h1>
                      {session.description && (
                        <p className="text-sm text-ivory/55 leading-relaxed max-w-xl">{session.description}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="h-8 w-3/4 rounded-xl bg-ivory/5 motion-safe:animate-pulse mb-3" />
                      <div className="h-4 w-1/2 rounded-lg bg-ivory/5 motion-safe:animate-pulse" />
                    </>
                  )}
                </div>
                {session ? (
                  <button
                    onClick={() => { toggleFavorite(session.id); toast(favorited ? "Removed from favorites" : "Added to favorites", "success"); }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border border-dashed cursor-pointer shrink-0 ${
                      favorited
                        ? "bg-chartreuse/15 border-chartreuse/40 text-chartreuse"
                        : "border-ivory/15 text-ivory/40 hover:text-chartreuse hover:border-chartreuse/30 hover:bg-chartreuse/5"
                    }`}
                    aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart size={16} fill={favorited ? "currentColor" : "none"} />
                  </button>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-ivory/5 motion-safe:animate-pulse shrink-0" aria-hidden="true" />
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-7">
              {session ? (
                <>
                  <InfoCard icon={<Calendar size={13} className="text-chartreuse" />} label="DATE & TIME">
                    <p className="text-sm font-semibold text-ivory leading-snug">{formatFullDate(startTime)}</p>
                    <p className="text-xs text-ivory/50">{formatTime(startTime)} – {formatTime(endTime)}</p>
                  </InfoCard>
                  <InfoCard icon={<MapPin size={13} className="text-chartreuse" />} label="LOCATION">
                    <p className="text-sm font-semibold text-ivory">{isOnline ? "Online" : session.room?.name ?? "TBD"}</p>
                    {session.venue && !isOnline && (
                      <p className="text-xs text-ivory/50">{session.venue.name}, {session.venue.city}</p>
                    )}
                  </InfoCard>
                  <InfoCard icon={<Users size={13} className="text-chartreuse" />} label="CAPACITY">
                    <p className="text-sm font-semibold text-ivory">{session.capacity ? `${session.capacity} seats` : "Open enrollment"}</p>
                  </InfoCard>
                </>
              ) : (
                <>
                  <InfoCardSkeleton />
                  <InfoCardSkeleton />
                  <InfoCardSkeleton />
                </>
              )}
            </div>

            {session && session.speakers.length > 0 ? (
              <div className="mb-7">
                <p className="label-mono text-ivory/40 mb-3 text-xs flex items-center gap-2">SPEAKERS</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {session.speakers.map((sp, i) => (
                    <SpeakerCard key={sp.id} speaker={sp} colorIndex={i} />
                  ))}
                </div>
              </div>
            ) : session ? null : (
              <div className="mb-7" aria-hidden="true">
                <p className="label-mono text-ivory/40 mb-3 text-xs flex items-center gap-2">SPEAKERS</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 px-3.5 py-3 rounded-xl motion-safe:animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="w-10 h-10 rounded-full bg-ivory/5 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-28 rounded-lg bg-ivory/5" />
                        <div className="h-3 w-20 rounded-lg bg-ivory/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {session ? (
              <VenueCard venue={session.venue!} room={session.room} isOnline={isOnline} />
            ) : (
              <div className="mb-7 rounded-xl overflow-hidden motion-safe:animate-pulse" style={{ border: "1px solid rgba(255,255,255,0.06)" }} aria-hidden="true">
                <div className="h-36 bg-ivory/5 flex items-center justify-center">
                  <MapPin size={24} className="text-ivory/20" aria-hidden="true" />
                </div>
                <div className="px-4 py-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="h-4 w-32 rounded-lg bg-ivory/5" />
                  <div className="h-3 w-24 rounded-lg bg-ivory/5" />
                </div>
              </div>
            )}
          </div>

          <div
            className="shrink-0 px-7 py-4 flex items-center gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}
          >
            {session ? (
              status.isLive ? (
                <Link
                  href={ROUTES.SESSION_LIVE(sessionId)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm font-bold text-charcoal hover:brightness-110 transition-all active:scale-[0.98]"
                  style={{ background: "hsl(59 73% 52%)", boxShadow: "0 0 0 1px hsl(59 73% 52%/0.4), 0 8px 20px -8px hsl(59 73% 52%/0.5)" }}
                >
                  <Play size={14} fill="currentColor" /> WATCH LIVE
                </Link>
              ) : status.isUpcoming ? (
                <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm font-bold text-ivory/40"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)" }}>
                  <Clock size={14} /> NOT YET LIVE
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm text-ivory/40"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)" }}>
                  <Clock size={14} /> SESSION ENDED
                </div>
              )
            ) : (
              <div className="flex-1 h-11 rounded-xl bg-ivory/5 motion-safe:animate-pulse" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
