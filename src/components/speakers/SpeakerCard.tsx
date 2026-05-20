"use client";

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
      className="block group p-6 border border-charcoal/10 bg-rice hover:bg-yellow/5 transition-all"
    >
      <div className="w-16 h-16 bg-charcoal/5 mb-4 flex items-center justify-center overflow-hidden">
        {speaker.avatar ? (
          <Image
            src={speaker.avatar}
            alt={speaker.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-2xl font-bold text-charcoal/20">
            {speaker.name.charAt(0)}
          </span>
        )}
      </div>

      <h3 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors mb-2">
        {speaker.name}
      </h3>

      <p className="text-xs text-charcoal/60 line-clamp-2 mb-4">
        {speaker.bio || "No bio available"}
      </p>

      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-yellow" />
        <span className="text-[0.6rem] tracking-wider text-charcoal/40">
          {speaker.eventSessionCount} SESSIONS
        </span>
      </div>
    </Link>
  );
}