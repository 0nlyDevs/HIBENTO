import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { EventSummaryDto } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<{ data: EventSummaryDto[]; pagination: { page: number; limit: number; total: number } } | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const upcoming = searchParams.get("upcoming") === "true";

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (upcoming) {
      where.startDate = { gte: new Date() };
    }

    // First get events without relations
    const events = await prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startDate: "asc" },
    });

    const total = await prisma.event.count({ where });

    // Then get session counts separately
    const sessionCounts = await prisma.session.groupBy({
      by: ['eventId'],
      where: {
        eventId: {
          in: events.map(e => e.id)
        }
      },
      _count: {
        id: true
      }
    });

    // Create a map of eventId -> session count
    const sessionCountMap = new Map(
      sessionCounts.map(sc => [sc.eventId, sc._count.id])
    );

    const data: EventSummaryDto[] = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      location: event.location,
      sessionCount: sessionCountMap.get(event.id) || 0,
    }));

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}