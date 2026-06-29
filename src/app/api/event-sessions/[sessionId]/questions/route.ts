import prisma from "@/lib/db/prisma";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";
import { isValidUUID } from "@/lib/utils/validation";
import type { QuestionDto } from "@/types/dto";
import type { Question } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse<{ data: QuestionDto[] } | { error: string }>> {
  try {
    const { sessionId } = await params;
    const q = new URL(request.url).searchParams.get("q");

    if (!isValidUUID(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = { eventSessionId: sessionId };
    if (q) {
      where.OR = [
        { content: { contains: q, mode: "insensitive" } },
        { authorName: { contains: q, mode: "insensitive" } },
      ];
    }

    const [session, questions] = await Promise.all([
      prisma.eventSession.findUnique({
        where: { id: sessionId },
      }),
      prisma.question.findMany({
        where,
        orderBy: { upvotes: "desc" },
      }),
    ]);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const response: QuestionDto[] = questions.map((q: Question) => ({
      id: q.id,
      content: q.content,
      authorName: q.authorName,
      upvotes: q.upvotes,
      createdAt: q.createdAt.toISOString(),
    }));

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (err) {
    console.error("GET /api/event-sessions/[sessionId]/questions error: ", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse<QuestionDto | { error: string }>> {
  try {
    const { sessionId } = await params;
    const { content, authorName }: { content: string; authorName: string } =
      await request.json();

    if (!isValidUUID(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    const session = await prisma.eventSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const isLive = getEventSessionStatus(session) === "live";
    if (!isLive) {
      return NextResponse.json(
        {
          error: "Questions can only be submitted for live sessions",
        },
        { status: 403 }
      );
    }

    const post = await prisma.question.create({
      data: {
        content: content,
        authorName: authorName || "Anonymous",
        eventSessionId: sessionId,
      },
    });

    const response: QuestionDto = {
      id: post.id,
      content: post.content,
      authorName: post.authorName,
      upvotes: post.upvotes,
      createdAt: post.createdAt.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error("POST /api/event-sessions/[sessionId]/questions error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}