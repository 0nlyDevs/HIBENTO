import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { EventSessionSummaryDto, RoomDto } from "@/types/dto";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";

type EventSessionWithSpeakers = {
  id: string;
  eventId: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  roomId: string | null;
  room: {
    id: string;
    name: string;
    capacity: number | null;
    venueId: string;
  } | null;
  speakers: Array<{
    speaker: {
      id: string;
      name: string;
      avatarUrl: string | null;
      bio: string | null;
    };
  }>;
};

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
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
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
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startTime: "asc" },
      }),
      prisma.eventSession.count({ where }),
    ]);

    let filteredSessions = sessions as unknown as EventSessionWithSpeakers[];

    if (status === "live") {
      filteredSessions = filteredSessions.filter(
        (session) => getEventSessionStatus(session) === "live"
      );
    } else if (status === "upcoming") {
      filteredSessions = filteredSessions.filter(
        (session) => getEventSessionStatus(session) === "upcoming"
      );
    } else if (status === "ended") {
      filteredSessions = filteredSessions.filter(
        (session) => getEventSessionStatus(session) === "ended"
      );
    }

    const data: EventSessionSummaryDto[] = filteredSessions.map((session) => {
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
        questionCount: 0,
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
