import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { EventSummaryDto, VenueDto } from "@/types/dto";

export async function GET(
  request: NextRequest
): Promise<NextResponse<{ data: EventSummaryDto[]; pagination: { page: number; limit: number; total: number } } | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const upcoming = searchParams.get("upcoming") === "true";
    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const search = searchParams.get("search") || searchParams.get("q");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const skip = (page - 1) * limit;

    const conditions: Record<string, unknown>[] = [];

    if (upcoming) {
      conditions.push({ startDate: { gte: new Date() } });
    }
    if (status) {
      const now = new Date();
      if (status === "live") {
        conditions.push({ startDate: { lte: now }, endDate: { gte: now } });
      } else if (status === "upcoming") {
        conditions.push({ startDate: { gt: now } });
      } else if (status === "ended") {
        conditions.push({ endDate: { lt: now } });
      }
    }
    if (city) {
      conditions.push({
        OR: [
          { venue: { city } },
          { isOnline: true },
        ],
      });
    }
    if (search) {
      conditions.push({ title: { contains: search, mode: "insensitive" } });
    }
    if (dateFrom) {
      conditions.push({ endDate: { gte: new Date(dateFrom) } });
    }
    if (dateTo) {
      conditions.push({ startDate: { lte: new Date(dateTo) } });
    }

    const where = conditions.length > 0 ? { AND: conditions } : {};

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: { venue: true },
        skip,
        take: limit,
        orderBy: { startDate: "asc" },
      }),
      prisma.event.count({ where }),
    ]);

    const eventSessionCounts = await prisma.eventSession.groupBy({
      by: ["eventId"],
      where: {
        eventId: {
          in: events.map((e) => e.id),
        },
      },
      _count: {
        id: true,
      },
    });

    const eventSessionCountMap = new Map(
      eventSessionCounts.map((sc) => [sc.eventId, sc._count.id])
    );

    const data: EventSummaryDto[] = events.map((event) => {
      const venueDto: VenueDto | null = event.venue
        ? {
            id: event.venue.id,
            name: event.venue.name,
            city: event.venue.city,
            neighborhood: event.venue.neighborhood,
            totalRooms: event.venue.totalRooms,
          }
        : null;

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        venue: venueDto,
        isOnline: event.isOnline,
        eventSessionCount: eventSessionCountMap.get(event.id) || 0,
      };
    });

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