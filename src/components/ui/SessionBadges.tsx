import { Wifi, MapPin } from "lucide-react";

interface SessionBadgesProps {
  isLive: boolean;
  isUpcoming: boolean;
  isEnded: boolean;
  isOnline: boolean;
  roomName?: string | null;
}

export function SessionBadges({ isLive, isUpcoming, isEnded, isOnline, roomName }: SessionBadgesProps) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {isLive && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full label-mono text-xs glow-chip">
          <span className="w-1.5 h-1.5 rounded-full bg-charcoal animate-pulse" />
          ONGOING
        </span>
      )}
      {isUpcoming && !isLive && (
        <span className="label-mono text-xs font-bold text-charcoal px-3 py-1 rounded-full bg-chartreuse">
          UPCOMING
        </span>
      )}
      {isEnded && (
        <span className="label-mono text-xs text-ivory/40 px-3 py-1 rounded-full bg-white/6 border border-dashed border-white/15">
          ENDED
        </span>
      )}
      {isOnline && (
        <span className="inline-flex items-center gap-1 label-mono text-xs px-3 py-1 rounded-full bg-indigo-500/15 border border-dashed border-indigo-400/40 text-indigo-300">
          <Wifi size={11} />
          ONLINE
        </span>
      )}
      {!isOnline && roomName && (
        <span className="inline-flex items-center gap-1 label-mono text-xs text-ivory/60 px-3 py-1 rounded-full bg-white/6 border border-dashed border-white/15">
          <MapPin size={11} />
          {roomName}
        </span>
      )}
    </div>
  );
}
