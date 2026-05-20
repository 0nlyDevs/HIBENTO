"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SpeakerCard } from "@/components/speakers/SpeakerCard";

export default function SpeakersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["speakers", page],
    queryFn: () => api.getSpeakers({ page, limit: 12 }),
  });

  const speakers = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="HiBento" width={28} height={28} />
            <span className="font-bold text-xl tracking-tighter text-charcoal">HIBENTO</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm text-charcoal/60 hover:text-charcoal">
              EVENTS
            </Link>
            <Link href="/speakers" className="text-sm font-bold text-charcoal border-b-2 border-charcoal">
              SPEAKERS
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-charcoal mb-2">SPEAKERS</h1>
          <p className="text-sm text-charcoal/60">Meet the experts and thought leaders</p>
        </div>

        {/* Speakers Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-charcoal/5 animate-pulse" />
            ))}
          </div>
        ) : speakers.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-xs tracking-wider border border-charcoal/20 disabled:opacity-30 hover:bg-charcoal/5"
                >
                  PREV
                </button>
                <span className="text-xs text-charcoal/40 px-4">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-xs tracking-wider border border-charcoal/20 disabled:opacity-30 hover:bg-charcoal/5"
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 border border-dashed border-charcoal/20">
            <p className="text-charcoal/40 text-sm tracking-wider">NO SPEAKERS FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
}