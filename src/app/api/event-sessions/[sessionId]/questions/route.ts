import prisma from "@/lib/db/prisma";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";
import { isValidUUID } from "@/lib/utils/validation";
import type { QuestionDto } from "@/types/dto";
import { toQuestionDto } from "@/lib/utils/mappers";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse<{ data: QuestionDto[] } | { error: string }>> {
  try {
    const { sessionId } = await params;
    if (!isValidUUID(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    const [session, questions] = await Promise.all([
      prisma.eventSession.findUnique({
        where: { id: sessionId },
      }),
      prisma.question.findMany({
        where: { eventSessionId: sessionId },
        orderBy: { upvotes: "desc" },
      }),
    ]);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const response: QuestionDto[] = questions.map(toQuestionDto);

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

    let content: unknown;
    let authorName: unknown;
    try {
      const body = await request.json();
      content = body?.content;
      authorName = body?.authorName;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required and must be a non-empty string" },
        { status: 400 },
      );
    }
    if (content.length > 10000) {
      return NextResponse.json(
        { error: "Content must be less than 10000 characters" },
        { status: 400 },
      );
    }
    if (authorName && (typeof authorName !== "string" || authorName.length > 100)) {
      return NextResponse.json(
        { error: "Author name must be less than 100 characters" },
        { status: 400 },
      );
    }

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
        content,
        authorName: (authorName as string) || "Anonymous",
        eventSessionId: sessionId,
      },
    });

    const response: QuestionDto = toQuestionDto(post);

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error("POST /api/event-sessions/[sessionId]/questions error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}