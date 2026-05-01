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
  context: RouteContext<"/api/events/[eventId]/sessions">
): Promise<NextResponse<{ data: SessionSummaryDto[] } | { error: string }>> {
  try {
    const { eventId } = await context.params;
    const url = new URL(request.url);
    const roomFilter = url.searchParams.get("room");
    const liveOnly = url.searchParams.get("liveOnly") === "true";

    if (!isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "invalid event id format" },
        { status: 400 }
      );
    }

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

    const where: Record<string, unknown> = {
      eventId: eventId
    };

    if (roomFilter) {
      where.room = roomFilter;
    }

    const rawSessions = await prisma.session.findMany({
      where,
      include: {
        speakers: {
          include: {
            speaker: true
          }
        }
      },
      orderBy: {
        startTime: "asc"
      }
    });

    const sessions = rawSessions as unknown as SessionWithSpeakers[];

    let filteredSessions = sessions;
    if (liveOnly) {
      filteredSessions = sessions.filter(session => getSessionStatus(session) === "live");
    }

    const data: SessionSummaryDto[] = filteredSessions.map((session) => ({
      id: session.id,
      title: session.title,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      room: session.room,
      isLive: getSessionStatus(session) === "live",
      speakers: session.speakers.map((sessionSpeaker) => ({ //we cqn add more detail if needed
        id: sessionSpeaker.speaker.id,
        name: sessionSpeaker.speaker.name
      })),
      questionCount: 0
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/events/:eventId/sessions] error:", err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}