import prisma from "@/lib/db/prisma";
import { SpeakerProfileDto } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  context: RouteContext<"/api/speakers/[speakerId]">,
): Promise<NextResponse<SpeakerProfileDto | { error: string }>> {
  try {
    const { speakerId } = await context.params;
    const speaker = await prisma.speaker.findUnique({
      where: {
        id: speakerId,
      },
      include: {
        links: { select: { linkType: true, url: true } },
        sessions: {
          select: {
            session: {
              select: {
                id: true,
                title: true,
                event: { select: { title: true } },
                startTime: true,
                room: { select: { name: true } },
              },
            },
          },
        },
      },
    });
    if (!speaker) {
      return NextResponse.json({ error: "Speaker not found" }, { status: 404 });
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
      sessions: speaker.sessions.map((s) => ({
        id: s.session.id,
        title: s.session.title,
        eventName: s.session.event.title,
        startTime: s.session.startTime.toISOString(),
        room: s.session.room.name,
      })),
    };
    return NextResponse.json(mappedSpeaker);
  } catch (err) {
    console.error("GET /api/speakers/[speakerId] error: ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 404 },
    );
  }
}
