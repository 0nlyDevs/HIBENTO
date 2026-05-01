import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { SessionDetailDto, SpeakerDetailDto, QuestionDto } from "@/types";
import { isValidUUID } from "@/lib/utils/validation";
import { getSessionStatus } from "@/lib/utils/getSessionStatus";

type SessionWithDetails = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  room: string;
  capacity: number | null;
  speakers: Array<{
    speaker: {
      id: string;
      name: string;
      avatar: string | null;
      bio: string | null;
    };
  }>;
  questions: Array<{
    id: string;
    content: string;
    authorName: string;
    upvotes: number;
    createdAt: Date;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext<"/api/sessions/[sessionId]">
): Promise<NextResponse<SessionDetailDto | { error: string }>> {
  try {
    const { sessionId } = await context.params;

    if (!isValidUUID(sessionId)) {
      return NextResponse.json(
        { error: "invalid session id format" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        speakers: {
          include: {
            speaker: true
          }
        },
        questions: {
          orderBy: {
            upvotes: "desc" as const
          }
        }
      }
    }) as SessionWithDetails | null;

    if (!session) {
      return NextResponse.json(
        { error: "session not found" },
        { status: 404 }
      );
    }

    const isLive = getSessionStatus(session) === "live";

    const response: SessionDetailDto = {
      id: session.id,
      title: session.title,
      description: session.description,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      room: session.room,
      capacity: session.capacity,
      isLive: isLive,
      speakers: session.speakers.map((sessionSpeaker): SpeakerDetailDto => ({
        id: sessionSpeaker.speaker.id,
        name: sessionSpeaker.speaker.name,
        avatar: sessionSpeaker.speaker.avatar,
        bio: sessionSpeaker.speaker.bio
      })),
      questions: isLive ? session.questions.map((question): QuestionDto => ({
        id: question.id,
        content: question.content,
        authorName: question.authorName,
        upvotes: question.upvotes,
        createdAt: question.createdAt.toISOString()
      })) : []
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("[GET /api/sessions/:sessionId] error:", err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}