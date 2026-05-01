import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { SessionSummaryDto } from "@/types";
import { isValidUUID } from "@/lib/utils/validation";
import { getSessionStatus } from "@/lib/utils/getSessionStatus";

type SessionWithSpeakers = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  room: string;
  speakers: Array<{
    speaker: {
      id: string;
      name: string;
    };
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext<"/api/events/[eventId]/rooms/[roomName]/sessions">
): Promise<NextResponse<{ data: SessionSummaryDto[] } | { error: string }>> {
  try {
    const { eventId, roomName } = await context.params;

    if (!isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "invalid event id format" },
        { status: 400 }
      );
    }

    const decodedRoomName = decodeURIComponent(roomName);

    const eventExists = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true }
    });

    if (!eventExists) {
      return NextResponse.json(
        { error: "event not found" },
        { status: 404 }
      );
    }

const rawSessions = await prisma.session.findMany({
  where: {
    eventId: eventId,
    room: {
      is: {
        name: decodedRoomName,
      },
    },
  },
  include: {
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

    if (rawSessions.length === 0) {
      return NextResponse.json(
        { error: "room not found" },
        { status: 404 }
      );
    }

    const sessions = rawSessions as unknown as SessionWithSpeakers[];

    const data: SessionSummaryDto[] = sessions.map((session) => ({
      id: session.id,
      title: session.title,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      room: session.room,
      isLive: getSessionStatus(session) === "live",
      speakers: session.speakers.map((sessionSpeaker) => ({
        id: sessionSpeaker.speaker.id,
        name: sessionSpeaker.speaker.name
      })),
      questionCount: 0
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/events/:eventId/rooms/:roomName/sessions] error:", err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}