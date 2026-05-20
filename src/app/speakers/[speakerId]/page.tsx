"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function SpeakerProfilePage() {
  const { speakerId } = useParams<{ speakerId: string }>();

  const { data: speaker, isLoading } = useQuery({
    queryKey: ["speaker", speakerId],
    queryFn: () => api.getSpeaker(speakerId),
    enabled: !!speakerId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none"></div>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-charcoal border-t-yellow animate-spin mx-auto mb-4"></div>
          <p className="text-sm tracking-wider text-charcoal/60">LOADING</p>
        </div>
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none"></div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">SPEAKER NOT FOUND</h1>
          <Link href="/speakers" className="btn-primary">BACK TO SPEAKERS</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none"></div>
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
          <Link href="/speakers" className="btn-outline text-xs py-2 px-4">
            {'\u2190'} ALL SPEAKERS
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="w-full aspect-square bg-charcoal/5 flex items-center justify-center mb-6">
              {speaker.avatar ? (
                <Image
                  src={speaker.avatar}
                  alt={speaker.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-6xl font-bold text-charcoal/20">
                  {speaker.name.charAt(0)}
                </span>
              )}
            </div>

            {speaker.externalLinks && speaker.externalLinks.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs tracking-wider text-charcoal/40 mb-3">
                  CONNECT
                </div>
                {speaker.externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block tag-pill w-full text-center hover:bg-yellow/30 transition-colors"
                  >
                    {link.type.toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-charcoal/30"></div>
              <span className="text-xs tracking-[0.3em] text-charcoal/60">
                SPEAKER PROFILE
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-charcoal mb-4">
              {speaker.name}
            </h1>

            <p className="text-lg text-charcoal/60 leading-relaxed mb-8">
              {speaker.bio}
            </p>

            <div className="border-t border-charcoal/10 pt-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-yellow"></div>
                <h2 className="text-lg font-bold tracking-wider text-charcoal">
                  UPCOMING SESSIONS
                </h2>
              </div>

              <div className="space-y-4">
                {speaker.eventSessions.map((s) => (
                  <Link
                    key={s.id}
                    href={`/sessions/${s.id}`}
                    className="block bento-card hover:bg-yellow/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-charcoal mb-1">
                          {s.title}
                        </h3>
                        <div className="flex gap-4 text-xs text-charcoal/50">
                          <span>{s.eventName}</span>
                          <span>{new Date(s.startTime).toLocaleDateString()}</span>
                          <span>{s.room}</span>
                        </div>
                      </div>
                      <div className="text-charcoal/30 text-xl shrink-0">{'\u2192'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
