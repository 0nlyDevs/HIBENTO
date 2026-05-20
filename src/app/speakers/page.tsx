"use client";

import { useState } from "react";
import Link from "next/link";
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