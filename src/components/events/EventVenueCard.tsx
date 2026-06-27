import { MapPin, Wifi, Building2, Navigation, ExternalLink } from "lucide-react";
import type { EventDetailDto } from "@/types/dto";

interface EventVenueCardProps {
  event: EventDetailDto;
}

function buildMapQueryUrl(venue: { name: string; neighborhood: string; city: string }): string {
  const q = encodeURIComponent(`${venue.name}, ${venue.neighborhood}, ${venue.city}`);
  return `https://www.google.com/maps/search/${q}`;
}

export function EventVenueCard({ event }: EventVenueCardProps) {
  if (!event.venue) {
    return (
      <div className="card-glass squircle-lg flex flex-col items-center justify-center py-10 gap-3">
        <Wifi size={28} className="text-chartreuse/60" />
        <p className="label-mono text-ivory/40">Online event</p>
        <p className="text-xs text-ivory/30">No physical location</p>
      </div>
    );
  }

  const venue = event.venue;
  const mapUrl = buildMapQueryUrl(venue);

  return (
    <div className="squircle-lg overflow-hidden card-glass group">

      <div
        className="h-44 flex items-center justify-center relative overflow-hidden"
        style={{ background: "#111316" }}
      >

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(59 73% 52% / 0.5) 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="absolute -inset-16 opacity-30">
          <div
            className="absolute w-48 h-48 rounded-full blur-3xl animate-pulse"
            style={{
              background: "radial-gradient(circle, hsl(59 73% 52% / 0.2), transparent 70%)",
              top: "10%",
              left: "20%",
            }}
          />
          <div
            className="absolute w-40 h-40 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(220 35% 62% / 0.15), transparent 70%)",
              bottom: "10%",
              right: "20%",
              animation: "pulse 3s ease-in-out infinite reverse",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className="w-11 h-11 rounded-full glow-chip flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
            <MapPin size={18} className="text-charcoal" />
          </div>
          <p className="text-sm font-bold text-ivory tracking-wide">{venue.city}</p>
          <span className="label-mono text-ivory/50 text-[0.55rem] uppercase tracking-widest">
            {venue.neighborhood}
          </span>
        </div>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-ivory/50 hover:text-chartreuse hover:bg-chartreuse/10 transition-all bg-black/30 backdrop-blur-sm"
          title="Open in Google Maps"
        >
          <ExternalLink size={13} />
        </a>
      </div>

      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Building2 size={13} className="text-chartreuse shrink-0" />
              <p className="text-sm font-bold text-ivory truncate">{venue.name}</p>
            </div>
            <p className="label-mono text-ivory/40 text-xs mt-1 flex items-center gap-1">
              <Navigation size={10} className="shrink-0" />
              {venue.neighborhood}, {venue.city}
            </p>
          </div>

          <div
            className="shrink-0 px-3 py-1.5 rounded-full flex items-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(255,255,255,0.12)" }}
          >
            <Building2 size={11} className="text-ivory/40" />
            <span className="label-mono text-ivory/60 text-[0.6rem]">
              {venue.totalRooms} {venue.totalRooms === 1 ? "ROOM" : "ROOMS"}
            </span>
          </div>
        </div>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl label-mono text-xs text-chartreuse/70 hover:text-chartreuse hover:bg-chartreuse/5 transition-all group/map"
          style={{ border: "1px dashed rgba(200,210,50,0.2)" }}
        >
          <MapPin size={12} />
          <span>VIEW ON GOOGLE MAPS</span>
          <ExternalLink size={10} className="opacity-0 -translate-x-1 group-hover/map:opacity-100 group-hover/map:translate-x-0 transition-all" />
        </a>
      </div>
    </div>
  );
}