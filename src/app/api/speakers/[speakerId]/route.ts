import prisma from "@/lib/db/prisma";
import type { SpeakerProfileDto } from "@/types/dto";
import { NextResponse } from "next/server";
import { isValidUUID } from "@/lib/utils/validation";

export async function GET(
  _: Request,
  context: RouteContext<"/api/speakers/[speakerId]">
): Promise<NextResponse<SpeakerProfileDto | { error: string }>> {
  try {
    const { speakerId } = await context.params;

    if (!isValidUUID(speakerId)) {
      return NextResponse.json(
        { error: "Invalid speaker ID format" },
        { status: 400 }
      );
    }

    const speaker = await prisma.speaker.findUnique({
      where: { id: speakerId },
      include: {
        links: { select: { linkType: true, url: true } },
        sessions: {
          include: {
            eventSession: {
              include: {
                event: { select: { title: true } },
                room: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!speaker) {
      return NextResponse.json(
        { error: "Speaker not found" },
        { status: 404 }
      );
    }

    const mappedSpeaker: SpeakerProfileDto = {
      id: speaker.id,
      name: speaker.name,
      avatar: speaker.avatarUrl,
      bio: speaker.bio,
      externalLinks: speaker.links.map((l) => ({
        type: l.linkType,
        url: l.url,
      })),
      eventSessions: speaker.sessions.map((s) => ({
        id: s.eventSession.id,
        title: s.eventSession.title,
        eventName: s.eventSession.event.title,
        startTime: s.eventSession.startTime.toISOString(),
        room: s.eventSession.room.name,
      })),
    };

    return NextResponse.json(mappedSpeaker);
  } catch (err) {
    console.error("GET /api/speakers/[speakerId] error: ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}