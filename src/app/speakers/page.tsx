"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { SpeakerSummaryDto } from "@/types/dto";

function SpeakerCard({ speaker }: { speaker: SpeakerSummaryDto }) {
  return (
    <Link
      href={`/speakers/${speaker.id}`}
      className="group card-glass squircle-lg overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_-12px_rgba(200,210,50,0.2)]"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/60 z-10" />
        {speaker.avatar ? (
          <Image
            src={speaker.avatar}
            alt={speaker.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(260 9% 14%), hsl(260 9% 22%))" }}>
            <span className="text-8xl font-black text-ivory/15">{speaker.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute top-4 right-4 z-20">
          <div className="w-10 h-10 rounded-full bg-chartreuse flex items-center justify-center shadow-lg shadow-chartreuse/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-chartreuse/50">
            <ArrowRight size={18} className="text-charcoal" />
          </div>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-chartreuse shrink-0" />
          <span className="label-mono text-[10px] text-ivory/50">{speaker.eventSessionCount} {speaker.eventSessionCount === 1 ? "SESSION" : "SESSIONS"}</span>
        </div>
        <h3 className="font-bold text-lg text-ivory group-hover:text-chartreuse transition-colors leading-snug mb-2">{speaker.name}</h3>
        {speaker.bio && (
          <p className="text-xs text-ivory/60 leading-relaxed line-clamp-3 flex-1">{speaker.bio}</p>
        )}
      </div>
    </Link>
  );
}

export default function SpeakersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["speakers", page],
    queryFn: () => api.getSpeakers({ page, limit: 8 }),
  });

  const speakers = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / 8);

  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="label-mono text-chartreuse mb-2">§ COMMUNITY</p>
            <h1 className="text-display text-[clamp(2.2rem,5vw,4rem)] text-ivory leading-none mb-3">
              Our Speakers
            </h1>
            <p className="text-sm text-ivory/70 leading-relaxed">
              Meet the experts and thought leaders shaping the future.
            </p>
          </div>
          <p className="label-mono text-ivory/40 pt-0.5 shrink-0">
            {isLoading ? "—" : `${total} ${total === 1 ? "SPEAKER" : "SPEAKERS"}`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-glass squircle-lg overflow-hidden">
                <div className="aspect-4/3 bg-white/5 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                  <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : speakers.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 label-mono text-ivory/70 rounded-full hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
                >
                  PREV
                </button>
                <span className="label-mono text-ivory/50 px-3">
                  {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 label-mono text-ivory/70 rounded-full hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 squircle-lg"
            style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}>
            <p className="label-mono text-ivory/60">NO SPEAKERS FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
}
