import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { EventSessionSummaryDto } from "@/types/dto";
import { toEventSessionSummary } from "@/lib/utils/mappers";
import { isValidUUID } from "@/lib/utils/validation";

type EventSessionWithSpeakers = {
  id: string;
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
  _count: {
    questions: number;
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
): Promise<NextResponse<{ data: EventSessionSummaryDto[] } | { error: string }>> {
  try {
    const { eventId } = await params;
    const url = new URL(request.url);
    const roomFilter = url.searchParams.get("room");
    const liveOnly = url.searchParams.get("liveOnly") === "true";

    if (!isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {
      eventId: eventId,
    };

    if (roomFilter && eventExists?.venueId) {
      where.room = {
        name: roomFilter,
        venueId: eventExists.venueId,
      };
    } else if (roomFilter) {
      where.room = {
        name: roomFilter,
      };
    }

    const [eventExists, rawSessions] = await Promise.all([
      prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true, isOnline: true, venueId: true },
      }),
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
          select: {
            questions: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    }),
  ]);

    if (!eventExists) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const eventIsOnline = eventExists.isOnline;
    const sessions = rawSessions as unknown as EventSessionWithSpeakers[];

    let filteredSessions = sessions;
    if (liveOnly) {
      filteredSessions = sessions.filter(
        (session) => getEventSessionStatus(session) === "live"
      );
    }

    const data: EventSessionSummaryDto[] = filteredSessions.map((session) =>
      toEventSessionSummary({ session, eventIsOnline }),
    );

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/events/:eventId/sessions] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}