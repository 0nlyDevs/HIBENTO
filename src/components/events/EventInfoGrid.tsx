import { Calendar, Clock, MapPin, Users, Wifi } from "lucide-react";
import type { EventDetailDto } from "@/types/dto";
import { formatDateRange, formatTime } from "@/lib/utils/dates";

interface EventInfoGridProps {
  event: EventDetailDto;
  isOnline: boolean;
}

export function EventInfoGrid({ event, isOnline }: EventInfoGridProps) {
  const s = new Date(event.startDate);
  const e = new Date(event.endDate);

  const infoCards = [
    {
      label: "DATES",
      value: formatDateRange(s, e),
      icon: <Calendar size={16} className="text-chartreuse" />,
    },
    {
      label: "TIME",
      value: `${formatTime(s)} – ${formatTime(e)}`,
      icon: <Clock size={16} className="text-chartreuse" />,
    },
    {
      label: "LOCATION",
      value: event.venue?.city ?? "Online",
      sub: event.venue?.neighborhood,
      icon: <MapPin size={16} className="text-chartreuse" />,
    },
    {
      label: "VENUE",
      value: event.venue?.name ?? "No venue",
      sub: event.venue ? `${event.venue.totalRooms} ROOMS` : undefined,
      icon: <Users size={16} className="text-chartreuse" />,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {infoCards.map(({ label, value, sub, icon }) => (
          <div key={label} className="card-glass squircle p-5 flex items-start gap-3">
            <div className="mt-1 shrink-0">{icon}</div>
            <div>
              <p className="label-mono text-ivory/40 mb-1 text-xs">{label}</p>
              <p className="text-base font-bold text-ivory leading-snug">{value}</p>
              {sub && <p className="label-mono text-ivory/40 mt-0.5 text-xs">{sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {!isOnline && (
        <div className="card-glass squircle-lg flex items-center gap-2.5 px-5 py-4 mb-6">
          <Wifi size={15} className="text-chartreuse shrink-0" />
          <p className="text-base text-ivory/65">
            <span className="text-ivory font-semibold">Onsite event.</span>{" "}
            You can also attend sessions online via HiBento.
          </p>
        </div>
      )}
    </>
  );
}