// src/app/speakers/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function SpeakersPage() {
  const { data: speakersResponse, isLoading } = useQuery({
    queryKey: ["speakers"],
    queryFn: () => api.getSpeakers()
  });

  // Now TypeScript knows the response has a data property
  const speakers = speakersResponse?.data || [];

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none"></div>
      {/* Navigation */}
      <nav className="border-b border-charcoal/10 bg-cream/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/logo.svg" 
              alt="HIBENTO" 
              width={28} 
              height={28} 
              className="group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-xl tracking-tighter text-charcoal">
              HIBENTO
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm font-medium tracking-wider
              text-charcoal/70 hover:text-charcoal transition-colors">
              EVENTS
            </Link>
            <Link href="/speakers" className="text-sm font-bold tracking-wider
              text-charcoal border-b-2 border-charcoal">
              SPEAKERS
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-charcoal/30"></div>
            <span className="text-xs tracking-[0.3em] text-charcoal/60 font-medium">
              SPEAKER DIRECTORY
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-charcoal">
            MEET THE SPEAKERS
          </h1>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bento-card animate-pulse">
                <div className="w-20 h-20 bg-charcoal/10 mb-4"></div>
                <div className="h-5 bg-charcoal/10 w-2/3 mb-2"></div>
                <div className="h-4 bg-charcoal/10 w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {speakers.map((speaker) => (
              <Link
                key={speaker.id}
                href={`/speakers/${speaker.id}`}
                className="bento-card group"
              >
                <div className="w-20 h-20 bg-charcoal/5 mb-4 flex items-center justify-center">
                  {speaker.avatar ? (
                    <Image
                      src={speaker.avatar}
                      alt={speaker.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-charcoal/20">
                      {speaker.name.charAt(0)}
                    </span>
                  )}
                </div>
                
                <h3 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors mb-2">
                  {speaker.name}
                </h3>
                
                <p className="text-sm text-charcoal/60 line-clamp-3 mb-4">
                  {speaker.bio}
                </p>
                
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow"></div>
                  <span className="text-xs tracking-wider text-charcoal/50">
                    {speaker.sessionCount} SESSIONS
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}