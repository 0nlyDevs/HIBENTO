import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { EventSessionSummaryDto, RoomDto } from "@/types/dto";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";

export async function GET(
  request: NextRequest
): Promise<NextResponse<{ data: EventSessionSummaryDto[]; pagination: { page: number; limit: number; total: number } } | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const q = searchParams.get("q");
    const eventId = searchParams.get("eventId");
    const roomId = searchParams.get("roomId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (eventId) {
      where.eventId = eventId;
    }
    if (roomId) {
      where.roomId = roomId;
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
      ];
    }

    const now = new Date();
    if (status === "live") {
      where.startTime = { lte: now };
      where.endTime = { gte: now };
    } else if (status === "upcoming") {
      where.startTime = { gt: now };
    } else if (status === "ended") {
      where.endTime = { lt: now };
    }

    const [sessions, total] = await Promise.all([
      prisma.eventSession.findMany({
        where,
        include: {
          room: {
            select: {
              id: true,
              name: true,
              capacity: true,
              venueId: true,
            },
          },
          speakers: {
            include: {
              speaker: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                  bio: true,
                },
              },
            },
          },
          _count: {
            select: { questions: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startTime: "asc" },
      }),
      prisma.eventSession.count({ where }),
    ]);

    const data: EventSessionSummaryDto[] = sessions.map((session) => {
      const roomDto: RoomDto | null = session.room
        ? {
            id: session.room.id,
            name: session.room.name,
            capacity: session.room.capacity,
            venueId: session.room.venueId,
          }
        : null;

      return {
        id: session.id,
        eventId: session.eventId,
        title: session.title,
        description: session.description,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime.toISOString(),
        room: roomDto,
        isOnline: session.room === null,
        isLive: getEventSessionStatus(session) === "live",
        speakers: session.speakers.map((s) => ({
          id: s.speaker.id,
          name: s.speaker.name,
          avatar: s.speaker.avatarUrl,
          bio: s.speaker.bio,
        })),
        questionCount: session._count.questions,
      };
    });

    return NextResponse.json({
      data,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
