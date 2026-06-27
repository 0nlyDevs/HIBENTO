import { MapPin } from "lucide-react";
import type { VenueDto, RoomDto } from "@/types/dto";

interface VenueCardProps {
  venue: VenueDto;
  room?: RoomDto | null;
  isOnline: boolean;
}

export function VenueCard({ venue, room, isOnline }: VenueCardProps) {
  if (isOnline || !venue) return null;

  return (
    <div className="mb-7 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="h-36 flex items-center justify-center relative" style={{ background: "#0e0f12" }}>
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(59 73% 52% / 0.5) 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="text-center relative z-10">
          <div className="w-10 h-10 rounded-full glow-chip flex items-center justify-center mx-auto mb-2">
            <MapPin size={16} className="text-charcoal" />
          </div>
          <p className="text-sm font-bold text-ivory">{venue.city}</p>
          <p className="label-mono text-ivory/40 text-[0.55rem] mt-0.5">{venue.neighborhood}</p>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div>
          <p className="text-sm font-semibold text-ivory">{venue.name}</p>
          <p className="text-xs text-ivory/45">{venue.neighborhood}, {venue.city}</p>
        </div>
        {room && (
          <span className="label-mono text-chartreuse text-xs">{room.name}</span>
        )}
      </div>
    </div>
  );
}
