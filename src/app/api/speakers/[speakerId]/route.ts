import prisma from "@/lib/db/prisma";
import type { SpeakerProfileDto } from "@/types/dto";
import { NextResponse } from "next/server";
import { isValidUUID } from "@/lib/utils/validation";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ speakerId: string }> }
): Promise<NextResponse<SpeakerProfileDto | { error: string }>> {
  try {
    const { speakerId } = await params;

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
                room: { include: { venue: { select: { neighborhood: true } } } },
                speakers: {
                  include: { speaker: { select: { id: true, name: true } } },
                },
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
        description: s.eventSession.description,
        eventName: s.eventSession.event.title,
        startTime: s.eventSession.startTime.toISOString(),
        endTime: s.eventSession.endTime.toISOString(),
        room: s.eventSession.room?.name ?? "Online",
        neighborhood: s.eventSession.room?.venue?.neighborhood ?? null,
        isLive: getEventSessionStatus(s.eventSession) === "live",
        speakers: s.eventSession.speakers
          .filter((es) => es.speaker.id !== speakerId)
          .map((es) => ({ id: es.speaker.id, name: es.speaker.name })),
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