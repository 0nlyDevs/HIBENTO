import { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";
import prisma from "@/lib/db/prisma";
import { generateEmbedding, generateBatchEmbeddings, findMostSimilar } from "@/ai";
import type { SearchResultDto } from "@/types/dto";

const RECOMMENDATION_CACHE = new LRUCache<string, SearchResultDto[]>({
  max: 100,
  ttl: 10 * 60 * 1000,
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ eventId: string }> },
): Promise<NextResponse<{ data: SearchResultDto[] } | { error: string }>> {
  try {
    const { eventId } = await params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { venue: true },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 },
      );
    }

    const cached = RECOMMENDATION_CACHE.get(eventId);
    if (cached) {
      return NextResponse.json({ data: cached }, { status: 200 });
    }

    const sourceText = [event.title, event.description]
      .filter(Boolean)
      .join(" ");
    const sourceVec = await generateEmbedding(sourceText);
    const otherEvents = await prisma.event.findMany({
      where: { id: { not: eventId } },
      include: { venue: true },
    });

    const otherTexts = otherEvents.map((e) =>
      [e.title, e.description, e.venue?.name ?? ""]
        .filter(Boolean)
        .join(" "),
    );

    const otherVecs = await generateBatchEmbeddings(otherTexts);

    const scored = findMostSimilar(sourceVec, otherVecs, 0.3).slice(0, 6);

    const results: SearchResultDto[] = scored.map((s) => {
      const e = otherEvents[s.index];
      const v = e.venue;
      return {
        id: e.id,
        title: e.title,
        description: e.description,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate.toISOString(),
        isOnline: e.isOnline,
        type: "event",
        score: Math.round(s.score * 1000) / 1000,
        match: {
          venue: v
            ? {
                id: v.id,
                name: v.name,
                city: v.city,
                neighborhood: v.neighborhood,
                totalRooms: v.totalRooms,
              }
            : null,
          speakers: [],
        },
      };
    });

    RECOMMENDATION_CACHE.set(eventId, results);

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (err) {
    console.error(
      "GET /api/ai/events/[eventId]/recommendations error:",
      err,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
