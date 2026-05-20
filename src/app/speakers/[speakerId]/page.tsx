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
    enabled: !!speakerId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-charcoal border-t-yellow animate-spin" />
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-charcoal">SPEAKER NOT FOUND</h1>
        <Link href="/speakers" className="text-sm text-charcoal/60 hover:text-charcoal underline">
          Back to speakers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="HiBento" width={28} height={28} />
            <span className="font-bold text-xl tracking-tighter text-charcoal">HIBENTO</span>
          </Link>
          <Link href="/speakers" className="text-sm text-charcoal/60 hover:text-charcoal">
            ← ALL SPEAKERS
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Links */}
          <div className="md:col-span-1">
            <div className="w-full aspect-square bg-charcoal/5 mb-6 flex items-center justify-center overflow-hidden">
              {speaker.avatar ? (
                <Image
                  src={speaker.avatar}
                  alt={speaker.name}
                  width={300}
                  height={300}
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
                <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-3">CONNECT</div>
                {speaker.externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 text-center text-xs tracking-wider border border-charcoal/20 hover:bg-yellow/10 transition-colors"
                  >
                    {link.type.toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Info & Sessions */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tighter text-charcoal mb-4">
                {speaker.name}
              </h1>
              <p className="text-base text-charcoal/60 leading-relaxed">
                {speaker.bio || "No bio available"}
              </p>
            </div>

            {speaker.eventSessions && speaker.eventSessions.length > 0 && (
              <div className="border-t border-charcoal/10 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 bg-yellow" />
                  <h2 className="text-sm font-bold tracking-wider text-charcoal">SESSIONS</h2>
                  <span className="text-[0.6rem] text-charcoal/40 ml-auto">
                    {speaker.eventSessions.length} TOTAL
                  </span>
                </div>

                <div className="space-y-3">
                  {speaker.eventSessions.map((session) => (
                    <Link
                      key={session.id}
                      href={`/sessions/${session.id}`}
                      className="block p-4 border border-charcoal/10 hover:bg-yellow/5 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors mb-1">
                            {session.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 text-xs text-charcoal/40">
                            <span>{session.eventName}</span>
                            <span>•</span>
                            <span>{new Date(session.startTime).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}</span>
                            <span>•</span>
                            <span>{session.room}</span>
                          </div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-charcoal/20 group-hover:text-charcoal transition-colors shrink-0 ml-4">
                          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}