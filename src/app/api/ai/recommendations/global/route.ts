import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import {
  generateEmbedding,
  generateBatchEmbeddings,
  findMostSimilar,
} from "@/ai";
import type { RecommendedEventDto } from "@/types/dto";

const MIN_SCORE = 0.2;
const MAX_RESULTS = 6;

export async function GET(
  request: NextRequest,
): Promise<
  NextResponse<{ data: RecommendedEventDto[] } | { error: string }>
> {
  try {
    const { searchParams } = new URL(request.url);
    const favoriteIds = searchParams
      .get("favorites")
      ?.split(",")
      .filter(Boolean);
    const currentEventId = searchParams.get("currentEventId");

    const now = new Date();

    // 1. Resolve favorite session IDs → parent event IDs
    let favoriteEventIds: string[] = [];
    if (favoriteIds && favoriteIds.length > 0) {
      const sessions = await prisma.eventSession.findMany({
        where: { id: { in: favoriteIds } },
        select: { eventId: true },
      });
      favoriteEventIds = [...new Set(sessions.map((s) => s.eventId))];
    }

    // 2. Fetch source events (favorites + current page)
    const sourceIds = [
      ...new Set([
        ...favoriteEventIds,
        ...(currentEventId ? [currentEventId] : []),
      ]),
    ];

    const sourceEvents =
      sourceIds.length > 0
        ? await prisma.event.findMany({ where: { id: { in: sourceIds } } })
        : [];

    // 3. Candidate pool: upcoming/live events, excluding sources
    const excludeIds = [...new Set(sourceIds)];
    const candidateEvents = await prisma.event.findMany({
      where: {
        id: { notIn: excludeIds },
        endDate: { gte: now },
      },
      include: { venue: true },
      orderBy: { startDate: "asc" },
    });

    if (candidateEvents.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 4. Batch-embed candidates
    const candidateTexts = candidateEvents.map((e) =>
      [e.title, e.description, e.venue?.name ?? ""]
        .filter(Boolean)
        .join(" "),
    );
    const candidateVecs = await generateBatchEmbeddings(candidateTexts);

    // 5. Score each source against candidates
    const scored = new Map<
      string,
      { score: number; reasons: Set<string> }
    >();

    const addIfBetter = (
      eventId: string,
      score: number,
      reason: string,
    ) => {
      const existing = scored.get(eventId);
      if (!existing || score > existing.score) {
        scored.set(eventId, { score, reasons: new Set([reason]) });
      } else if (existing && score > 0) {
        existing.reasons.add(reason);
      }
    };

    for (const source of sourceEvents) {
      const sourceText = [source.title, source.description]
        .filter(Boolean)
        .join(" ");
      const sourceVec = await generateEmbedding(sourceText);
      const similar = findMostSimilar(sourceVec, candidateVecs, MIN_SCORE);

      let reason = "";
      if (currentEventId === source.id) {
        reason = `Similar to ${source.title} you're exploring`;
      } else if (favoriteEventIds.includes(source.id)) {
        reason = `Because you favorited a session in ${source.title}`;
      }

      for (const s of similar) {
        addIfBetter(candidateEvents[s.index].id, s.score, reason);
      }
    }

    // 6. Trending — events with most upvoted questions
    const trending = await prisma.event.findMany({
      where: {
        id: { notIn: excludeIds },
        endDate: { gte: now },
      },
      include: {
        eventSessions: {
          include: { questions: { select: { upvotes: true } } },
        },
      },
    });

    const trendingUpvotes = trending.map((e) => {
      const total = e.eventSessions.reduce(
        (sum, s) =>
          sum + s.questions.reduce((qsum, q) => qsum + q.upvotes, 0),
        0,
      );
      return { id: e.id, upvotes: total };
    });

    const maxUpvotes = Math.max(...trendingUpvotes.map((t) => t.upvotes), 1);
    for (const t of trendingUpvotes) {
      if (t.upvotes === 0) continue;
      const normalized = t.upvotes / maxUpvotes;
      addIfBetter(t.id, normalized * 0.5, "Trending among attendees");
    }

    // 7. Also check same venue as a source
    for (const source of sourceEvents) {
      if (!source.venueId) continue;
      for (const c of candidateEvents) {
        if (c.venueId === source.venueId) {
          addIfBetter(
            c.id,
            0.25,
            `Also happening at ${c.venue?.name ?? "the same venue"}`,
          );
        }
      }
    }

    // 8. Sort and cap
    const sorted = [...scored.entries()]
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, MAX_RESULTS);

    const data: RecommendedEventDto[] = sorted.map(([id, { score, reasons }]) => {
      const event = candidateEvents.find((e) => e.id === id)!;
      const v = event.venue;
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        isOnline: event.isOnline,
        type: "event",
        score: Math.round(score * 1000) / 1000,
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
        reasons: [...new Set(reasons)],
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("GET /api/ai/recommendations/global error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
