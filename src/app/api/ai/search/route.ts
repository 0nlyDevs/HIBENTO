import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { generateEmbedding, generateBatchEmbeddings, cosineSimilarity } from "@/ai";
import type { SearchResultDto } from "@/types/dto";

interface CachedEventEmbedding {
  embedding: Float32Array;
  event: {
    id: string;
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    isOnline: boolean;
    venue: {
      id: string;
      name: string;
      city: string;
      neighborhood: string;
      totalRooms: number;
    } | null;
  };
}

let cachedEmbeddings: CachedEventEmbedding[] | null = null;
let cachedAt = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(
  request: NextRequest,
): Promise<
  NextResponse<{ data: SearchResultDto[] } | { error: string }>
> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 },
      );
    }

    const now = Date.now();
    if (!cachedEmbeddings || now - cachedAt > CACHE_TTL) {
      const events = await prisma.event.findMany({
        include: { venue: true },
        orderBy: { startDate: "asc" },
      });

      const texts = events.map((e) =>
        [e.title, e.description, e.venue?.name ?? ""]
          .filter(Boolean)
          .join(" "),
      );

      const embeddings = await generateBatchEmbeddings(texts);

      cachedEmbeddings = events.map((event, i) => ({
        embedding: embeddings[i],
        event: {
          id: event.id,
          title: event.title,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          isOnline: event.isOnline,
          venue: event.venue
            ? {
                id: event.venue.id,
                name: event.venue.name,
                city: event.venue.city,
                neighborhood: event.venue.neighborhood,
                totalRooms: event.venue.totalRooms,
              }
            : null,
        },
      }));
      cachedAt = now;
    }

    const queryVec = await generateEmbedding(query);

    const scored = cachedEmbeddings
      .map((item) => ({
        item,
        score: cosineSimilarity(queryVec, item.embedding),
      }))
      .filter((s) => s.score > 0.15)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const data: SearchResultDto[] = scored.map((s) => {
      const v = s.item.event.venue;
      return {
        id: s.item.event.id,
        title: s.item.event.title,
        description: s.item.event.description,
        startDate: s.item.event.startDate.toISOString(),
        endDate: s.item.event.endDate.toISOString(),
        isOnline: s.item.event.isOnline,
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

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("GET /api/ai/search error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
