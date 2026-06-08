import Image from "next/image";
import { MapPin, Wifi } from "lucide-react";
import type { EventDetailDto } from "@/types/dto";
import { pickEventImage } from "./constants";

interface EventHeroProps {
  event: EventDetailDto;
  isLive: boolean;
  isEnded: boolean;
}

export function EventHero({ event, isLive, isEnded }: EventHeroProps) {
  const heroImg = pickEventImage(event.id);

  return (
    <div className="relative overflow-hidden squircle-lg min-h-[260px] flex flex-col justify-end mb-4">
      <Image
        src={heroImg}
        alt={event.title}
        fill
        className="object-cover object-center"
        sizes="1000px"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/92 via-black/45 to-transparent" />

      <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
        {isLive && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full label-mono text-xs glow-chip">
            <span className="w-1.5 h-1.5 rounded-full bg-charcoal animate-pulse" />
            LIVE NOW
          </span>
        )}
        {!isLive && !isEnded && (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full label-mono text-xs font-bold text-charcoal bg-chartreuse"
            style={{ boxShadow: "0 0 0 1px hsl(59 73% 52%/0.4)" }}
          >
            UPCOMING
          </span>
        )}
        {isEnded && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full label-mono text-xs text-ivory/60 card-glass">
            ENDED
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full label-mono text-xs text-ivory/80 card-glass">
          {event.isOnline ? (
            <>
              <Wifi size={10} />
              ONLINE
            </>
          ) : (
            <>
              <MapPin size={10} />
              {event.venue?.city}
            </>
          )}
        </span>
      </div>

      <div className="relative z-10 px-6 py-6">
        <p className="label-mono text-chartreuse mb-1">§ EVENT</p>
        <h1 className="text-display text-[clamp(1.6rem,4vw,2.8rem)] text-ivory leading-tight">
          {event.title}
        </h1>
        {event.description && (
          <p className="text-sm text-ivory/65 mt-2 max-w-2xl line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
