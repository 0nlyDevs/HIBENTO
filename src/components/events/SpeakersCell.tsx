"use client";

import Link from "next/link";
import Image from "next/image";
import * as HoverCard from "@radix-ui/react-hover-card";
import type { SpeakerRefDto } from "@/types/dto";
import { AVATAR_COLORS } from "./constants";

function SpeakerAvatar({
  speaker,
  colorIndex,
  size = 32,
}: {
  speaker: SpeakerRefDto;
  colorIndex: number;
  size?: number;
}) {
  const sizeClass = size === 32 ? "w-8 h-8" : "w-10 h-10";
  return (
    <div
      className={`${sizeClass} rounded-full shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-black/50`}
      style={{ background: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}
    >
      {speaker.avatar ? (
        <Image
          src={speaker.avatar}
          alt={speaker.name}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      ) : (
        <span>{speaker.name.charAt(0)}</span>
      )}
    </div>
  );
}

export function SpeakersCell({ speakers }: { speakers: SpeakerRefDto[] }) {
  if (speakers.length === 0) {
    return <span className="text-sm text-ivory/30">—</span>;
  }

  return (
    <HoverCard.Root openDelay={100} closeDelay={150}>
      <HoverCard.Trigger asChild>
        <div className="flex items-center cursor-pointer group/sp">

          <div className="flex -space-x-2.5">
            {speakers.slice(0, 4).map((sp, i) => (
              <Link
                key={sp.id}
                href={`/speakers/${sp.id}`}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 transition-transform duration-200 hover:-translate-y-1.5 hover:z-20"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <div
                  className="w-8 h-8 rounded-full ring-2 ring-charcoal overflow-hidden flex items-center justify-center text-xs font-bold shrink-0 text-black/50"
                  style={{
                    background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  }}
                >
                  <SpeakerAvatar speaker={sp} colorIndex={i} />
                </div>
              </Link>
            ))}
            {speakers.length > 4 && (
              <div className="w-8 h-8 rounded-full ring-2 ring-charcoal bg-white/10 flex items-center justify-center text-xs font-bold text-ivory/60 transition-transform duration-200 hover:-translate-y-1">
                +{speakers.length - 4}
              </div>
            )}
          </div>

        </div>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className="z-50 p-3 min-w-65 squircle-lg animate-slide-up"
          style={{
            background: "#18181c",
            border: "1px dashed rgba(255,255,255,0.18)",
            boxShadow: "0 16px 40px -8px rgba(0,0,0,0.8)",
          }}
          sideOffset={10}
          align="start"
        >

          <div className="px-1 pb-2 mb-2" style={{ borderBottom: "1px dashed rgba(255,255,255,0.1)" }}>
            <p className="label-mono text-chartreuse text-xs">
              {speakers.length} {speakers.length === 1 ? "SPEAKER" : "SPEAKERS"}
            </p>
          </div>

          <div className="space-y-1">
            {speakers.map((sp, i) => (
              <Link
                key={sp.id}
                href={`/speakers/${sp.id}`}
                onClick={() => {
                  const event = document.createEvent("HTMLEvents");
                  event.initEvent("mouseleave", true, false);
                  document.dispatchEvent(event);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group/link hover:-translate-x-0.5"
              >
                <SpeakerAvatar speaker={sp} colorIndex={i} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-ivory group-hover/link:text-chartreuse transition-colors truncate">
                      {sp.name}
                    </p>
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className="shrink-0 text-chartreuse opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all"
                    >
                      <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                  {sp.bio && (
                    <p className="text-xs text-ivory/40 truncate leading-relaxed mt-0.5">
                      {sp.bio.split(".")[0]}
                      {sp.bio.includes(".") ? "." : ""}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <HoverCard.Arrow className="fill-[#18181c]" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}