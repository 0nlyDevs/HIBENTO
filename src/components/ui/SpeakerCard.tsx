import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, ChevronRight } from "lucide-react";
import type { SpeakerDetailDto } from "@/types/dto";
import { ROUTES } from "@/constants/routes";
import { AVATAR_COLORS } from "@/constants/theme";

interface SpeakerCardProps {
  speaker: SpeakerDetailDto;
  colorIndex: number;
  onClose?: () => void;
}

export function SpeakerCard({ speaker, colorIndex, onClose }: SpeakerCardProps) {
  return (
    <Link
      key={speaker.id}
      href={ROUTES.SPEAKER_DETAIL(speaker.id)}
      onClick={onClose}
      className="flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all hover:-translate-y-0.5 group"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-sm font-bold"
        style={{
          background: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length],
          color: "rgba(0,0,0,0.5)",
        }}
      >
        {speaker.avatar ? (
          <Image src={speaker.avatar} alt={speaker.name} width={40} height={40} className="object-cover w-full h-full" />
        ) : (
          speaker.name.charAt(0)
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ivory group-hover:text-chartreuse transition-colors flex items-center gap-1.5">
          {speaker.name}
          <BadgeCheck size={12} className="text-chartreuse shrink-0" />
        </p>
        {speaker.bio && (
          <p className="text-xs text-ivory/45 line-clamp-1 leading-relaxed mt-0.5">
            {speaker.bio.split(".")[0]}.
          </p>
        )}
      </div>
      <ChevronRight
        size={14}
        className="text-ivory/20 group-hover:text-chartreuse/50 group-hover:translate-x-0.5 transition-all shrink-0"
      />
    </Link>
  );
}
