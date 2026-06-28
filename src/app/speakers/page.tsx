import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import prisma from "@/lib/db/prisma";
import type { SpeakerSummaryDto } from "@/types/dto";
import { PaginationBar } from "@/components/ui/PaginationBar";

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

const LIMIT = 8;

export default async function SpeakersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, Number(resolvedParams.page) || 1);

  const [speakers, total] = await Promise.all([
    prisma.speaker.findMany({
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        bio: true,
        _count: {
          select: { sessions: true },
        },
      },
      take: LIMIT,
      skip: (page - 1) * LIMIT,
    }),
    prisma.speaker.count(),
  ]);

  const mappedSpeakers: SpeakerSummaryDto[] = speakers.map((s) => ({
    id: s.id,
    name: s.name,
    bio: s.bio,
    avatar: s.avatarUrl ?? null,
    eventSessionCount: s._count.sessions,
  }));

  const totalPages = Math.ceil(total / LIMIT);

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
            {total} {total === 1 ? "SPEAKER" : "SPEAKERS"}
          </p>
        </div>

        {mappedSpeakers.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
              {mappedSpeakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>

            {totalPages > 1 && (
              <Suspense fallback={null}>
                <PaginationBar
                  page={page}
                  totalPages={totalPages}
                  basePath="/speakers"
                />
              </Suspense>
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
