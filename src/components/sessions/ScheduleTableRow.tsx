"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Wifi, Heart, Play, UserPlus, Eye } from "lucide-react";
import type { ScheduleSession } from "@/types/schedule";
import type { SpeakerRefDto } from "@/types/dto";
import { formatShortDate, formatTimeRange } from "@/lib/utils/dates";
import { SpeakersCell } from "@/components/events/SpeakersCell";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useToast } from "@/components/ui/Toast";

const GRID_DEFAULT = "150px minmax(280px, 1fr) 160px 130px 120px";
const GRID_EXTENDED = "150px minmax(280px, 1fr) 160px 130px 100px 130px";

export const TABLE_MIN_W_DEFAULT = "min-w-[960px]";
export const TABLE_MIN_W_EXTENDED = "min-w-[1080px]";

function toSpeakerRefs(speakers: ScheduleSession["speakers"]): SpeakerRefDto[] {
  return speakers.map((s) => ({
    id: s.id,
    name: s.name,
    avatar: s.image ?? null,
    bio: s.bio ?? null,
  }));
}

export interface ScheduleTableRowProps {
  session: ScheduleSession;
  isLast: boolean;
  index?: number;
  variant?: "default" | "extended";
  onSessionClick?: (session: ScheduleSession) => void;
}

export function ScheduleTableRow({
  session,
  isLast,
  index = 0,
  variant = "default",
  onSessionClick,
}: ScheduleTableRowProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  const sStart = session.startTime;
  const sEnd = session.endTime;
  const sIsLive = session.isLive;
  const now = new Date();
  const sEnded = sEnd < now;
  const sUpcoming = sStart > now && !sIsLive;
  const canRegister = sUpcoming && session.isOnline === false && !sEnded;
  const favorited = isFavorite(session.id);
  const gridColumns = variant === "extended" ? GRID_EXTENDED : GRID_DEFAULT;

  const navigateToSession = () => {
    if (onSessionClick) {
      onSessionClick(session);
      return;
    }
    router.push(`/sessions/detail/${session.id}`);
  };

  const prefetchSession = () => {
    if (!onSessionClick) {
      router.prefetch(`/sessions/detail/${session.id}`);
    }
  };

  const handleRowKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigateToSession();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={navigateToSession}
      onMouseEnter={prefetchSession}
      onKeyDown={handleRowKeyDown}
      className={`gap-4 px-6 py-5 group transition-colors items-center border-b border-dashed cursor-pointer hover:bg-white/3 outline-none focus-visible:ring-1 focus-visible:ring-chartreuse/40 schedule-row-fade-in ${
        isLast ? "border-transparent" : "border-white/8"
      } ${sIsLive ? "bg-chartreuse/4" : ""}`}
      style={{
        display: "grid",
        gridTemplateColumns: gridColumns,
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className="flex flex-col">
        <span className="text-base font-semibold text-ivory/90">
          {formatShortDate(sStart)}
        </span>
        <span className="text-sm text-ivory/55 mt-0.5">
          {formatTimeRange(sStart, sEnd)}
        </span>
      </div>

      <div className="flex flex-col overflow-hidden">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          {sIsLive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full label-mono text-xs glow-chip shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          )}
          {sUpcoming && (
            <span className="label-mono text-xs font-bold text-charcoal px-2 py-0.5 rounded-full shrink-0 bg-chartreuse">
              UPCOMING
            </span>
          )}
          {sEnded && !sIsLive && (
            <span className="label-mono text-xs text-ivory/35 shrink-0">
              ENDED
            </span>
          )}
        </div>
        <span className="font-bold text-base text-ivory group-hover:text-chartreuse transition-colors line-clamp-1 mb-1.5">
          {session.title}
        </span>
        {session.subtitle && (
          <span className="text-xs text-ivory/45 mb-1">{session.subtitle}</span>
        )}
        {session.description && (
          <p className="text-sm text-ivory/55 line-clamp-2 leading-relaxed">
            {session.description}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        {session.isOnline ? (
          <span className="flex items-center gap-1.5 text-base text-ivory/65">
            <Wifi size={14} className="text-chartreuse shrink-0" />
            ONLINE
          </span>
        ) : (
          <span className="text-base font-semibold text-ivory/90 leading-snug">
            {session.venue}
          </span>
        )}
      </div>

      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
        <SpeakersCell speakers={toSpeakerRefs(session.speakers)} />
      </div>

      {variant === "default" ? (
        <div className="flex items-center">
          {sIsLive ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-chartreuse">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live Now
            </span>
          ) : (
            <span className="text-sm text-ivory/55">
              {formatShortDate(sStart)}
            </span>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold text-charcoal bg-chartreuse"
              style={{ boxShadow: "0 0 0 1px hsl(59 73% 52% / 0.3)" }}
            >
              {session.isOnline ? "Online" : "In Person"}
            </span>
          </div>

          <div
            className="flex items-center justify-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                toggleFavorite(session.id);
                toast(
                  favorited ? "Removed from favorites" : "Added to favorites",
                  "success",
                );
              }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border border-dashed cursor-pointer shrink-0 ${
                favorited
                  ? "bg-chartreuse/15 border-chartreuse/40 text-chartreuse"
                  : "border-ivory/15 text-ivory/40 hover:text-chartreuse hover:border-chartreuse/30 hover:bg-chartreuse/5"
              }`}
              title={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={16} fill={favorited ? "currentColor" : "none"} />
            </button>

            {sIsLive ? (
              <Link
                href={`/sessions/${session.id}`}
                className="w-9 h-9 rounded-lg flex items-center justify-center glow-chip transition-all hover:brightness-110 cursor-pointer shrink-0"
                title="Watch live"
              >
                <Play size={14} fill="currentColor" />
              </Link>
            ) : canRegister ? (
              <Link
                href={`/sessions/detail/${session.id}`}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-chartreuse text-charcoal transition-all hover:brightness-110 cursor-pointer shrink-0"
                style={{ boxShadow: "0 0 0 1px hsl(59 73% 52% / 0.3)" }}
                title="Register for this session"
              >
                <UserPlus size={14} />
              </Link>
            ) : (
              <Link
                href={`/sessions/detail/${session.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-ivory/50 transition-all hover:text-ivory hover:bg-white/5 cursor-pointer shrink-0"
                style={{ border: "1px dashed rgba(255,255,255,0.12)" }}
                title="View details"
              >
                <Eye size={12} />
                VIEW
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function ScheduleTableHeader({
  variant = "default",
}: {
  variant?: "default" | "extended";
}) {
  const gridColumns = variant === "extended" ? GRID_EXTENDED : GRID_DEFAULT;

  return (
    <div
      className="gap-4 px-6 py-3.5 border-b border-dashed border-white/10 bg-white/3"
      style={{ display: "grid", gridTemplateColumns: gridColumns }}
    >
      <span className="text-sm font-medium text-ivory/55 inline-flex items-center gap-1.5">
        <Clock size={14} className="text-chartreuse/70" />
        Time
      </span>
      <span className="text-sm font-medium text-ivory/55">Session</span>
      <span className="text-sm font-medium text-ivory/55">Venue</span>
      <span className="text-sm font-medium text-ivory/55">Speakers</span>
      {variant === "default" ? (
        <span className="text-sm font-medium text-ivory/55">Status</span>
      ) : (
        <>
          <span className="text-sm font-medium text-ivory/55">Format</span>
          <span className="text-sm font-medium text-ivory/55 text-center">
            Actions
          </span>
        </>
      )}
    </div>
  );
}
