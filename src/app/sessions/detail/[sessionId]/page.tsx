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
  const { data: session } = useGetEventSession(sessionId);

  if (!session) {
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
            BACK
          </button>

          <div className="w-full squircle-lg overflow-hidden animate-pulse" style={{ background: "#131418", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="h-1 w-full bg-white/5 shrink-0 rounded-t-[1rem]" />
            <div className="px-7 py-6 space-y-6">
              <div className="space-y-3">
                <div className="h-5 w-32 rounded-full bg-white/5" />
                <div className="h-8 w-3/4 rounded-xl bg-white/5" />
                <div className="h-4 w-1/2 rounded-lg bg-white/5" />
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="h-3 w-20 rounded-full bg-white/5" />
                    <div className="h-4 w-28 rounded-lg bg-white/5" />
                    <div className="h-3 w-20 rounded-lg bg-white/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  const { isLive, isUpcoming, isEnded } = getSessionStatus(session);
  const isOnline = session.isOnline;
  const favorited = isFavorite(session.id);

  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => session ? router.push(ROUTES.EVENT_DETAIL(session.eventId)) : router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ivory/70 hover:text-ivory transition-colors mb-6 group cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:-translate-x-0.5">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          BACK
        </button>

        <div className="w-full squircle-lg overflow-hidden" style={{ background: "#131418", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="h-1 w-full bg-chartreuse shrink-0 rounded-t-[1rem]" />

          <div className="px-7 py-6">
            <div className="mb-7">
              <SessionBadges isLive={isLive} isUpcoming={isUpcoming} isEnded={isEnded} isOnline={isOnline} roomName={session.room?.name} />

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-display text-[clamp(1.5rem,3.5vw,2.2rem)] text-ivory leading-tight mb-3">
                    {session.title}
                  </h1>
                  {session.description && (
                    <p className="text-sm text-ivory/55 leading-relaxed max-w-xl">{session.description}</p>
                  )}
                </div>
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
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-7">
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
            </div>

            {session.speakers.length > 0 && (
              <div className="mb-7">
                <p className="label-mono text-ivory/40 mb-3 text-xs flex items-center gap-2">SPEAKERS</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {session.speakers.map((sp, i) => (
                    <SpeakerCard key={sp.id} speaker={sp} colorIndex={i} />
                  ))}
                </div>
              </div>
            )}

            <VenueCard venue={session.venue!} room={session.room} isOnline={isOnline} />
          </div>

          <div className="shrink-0 px-7 py-4 flex items-center gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}>
            {isLive ? (
              <Link href={ROUTES.SESSION_LIVE(sessionId)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm font-bold text-charcoal hover:brightness-110 transition-all active:scale-[0.98]"
                style={{ background: "hsl(59 73% 52%)", boxShadow: "0 0 0 1px hsl(59 73% 52%/0.4), 0 8px 20px -8px hsl(59 73% 52%/0.5)" }}>
                <Play size={14} fill="currentColor" /> WATCH LIVE
              </Link>
            ) : isUpcoming ? (
              <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm font-bold text-ivory/40"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)" }}>
                <Clock size={14} /> NOT YET LIVE
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm text-ivory/40"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)" }}>
                <Clock size={14} /> SESSION ENDED
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
