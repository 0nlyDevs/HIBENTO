import Link from "next/link";
import Image from "next/image";
import type { SpeakerSummaryDto } from "@/types/dto";

interface SpeakerCardProps {
  speaker: SpeakerSummaryDto;
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  return (
    <Link
      href={`/speakers/${speaker.id}`}
      className="group relative block overflow-hidden transition-all duration-300 hover:-translate-y-0.5 card-glass squircle"
    >

      <div className="absolute left-0 top-0 bottom-0 w-1 bg-chartreuse/60 rounded-l-xl" />
      <div className="flex items-center gap-4 p-4 pl-5">

        <div className="w-14 h-14 rounded-full bg-ivory/5 flex items-center justify-center overflow-hidden ring-1 ring-ivory/10 shrink-0 group-hover:ring-chartreuse/40 transition-all duration-300">
          {speaker.avatar ? (
            <Image src={speaker.avatar} alt={speaker.name} width={56} height={56} className="object-cover w-full h-full" />
          ) : (
            <span className="text-xl font-bold text-ivory/45">{speaker.name.charAt(0)}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-ivory group-hover:text-chartreuse transition-colors text-sm">
              {speaker.name}
            </h3>
            <span className="label-mono text-ivory/40">
              #{speaker.eventSessionCount}
            </span>
          </div>
          {speaker.bio && (
            <p className="text-[0.6rem] text-ivory/60 leading-relaxed line-clamp-1">{speaker.bio}</p>
          )}
        </div>

        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-ivory/30 group-hover:text-ivory/60 shrink-0 transition-colors">
          <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    </Link>
  );
}
