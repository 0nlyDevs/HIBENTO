import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { EventSessionSummaryDto, RoomDto } from "@/types/dto";
import { isValidUUID } from "@/lib/utils/validation";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";

type EventSessionWithSpeakers = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  room: {
    id: string;
    name: string;
    capacity: number | null;
    venueId: string;
  };
  speakers: Array<{
    speaker: {
      id: string;
      name: string;
    };
  }>;
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

    const eventExists = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!eventExists) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const where: Record<string, unknown> = {
      eventId: eventId,
    };

    if (roomFilter) {
      where.room = {
        name: roomFilter,
      };
    }

    const rawSessions = await prisma.eventSession.findMany({
      where,
      include: {
        room: true,
        speakers: {
          include: {
            speaker: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    const sessions = rawSessions as unknown as EventSessionWithSpeakers[];

    let filteredSessions = sessions;
    if (liveOnly) {
      filteredSessions = sessions.filter(
        (session) => getEventSessionStatus(session) === "live"
      );
    }

    const data: EventSessionSummaryDto[] = filteredSessions.map((session) => {
      const roomDto: RoomDto = {
        id: session.room.id,
        name: session.room.name,
        capacity: session.room.capacity,
        venueId: session.room.venueId,
      };

      return {
        id: session.id,
        title: session.title,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime.toISOString(),
        room: roomDto,
        isLive: getEventSessionStatus(session) === "live",
        speakers: session.speakers.map((sessionSpeaker) => ({
          id: sessionSpeaker.speaker.id,
          name: sessionSpeaker.speaker.name,
        })),
        questionCount: 0,
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/events/:eventId/sessions] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}