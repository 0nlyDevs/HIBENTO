import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { RoomDto } from "@/types";
import { isValidUUID } from "@/lib/utils/validation";

export async function GET(
  request: Request,
  context: RouteContext<"/api/events/[eventId]/rooms">
): Promise<NextResponse<{ data: RoomDto[] } | { error: string }>> {
  try {
    const { eventId } = await context.params;

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

const sessions = await prisma.session.findMany({
  where: { eventId },
  select: {
    room: {
      select: {
        name: true,
      },
    },
  },
  distinct: ["roomId"],
});

const data: RoomDto[] = sessions.map((session, index) => ({
  id: `room_${index + 1}`,
  name: session.room.name,
}));

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/events/:eventId/rooms] error:", err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}