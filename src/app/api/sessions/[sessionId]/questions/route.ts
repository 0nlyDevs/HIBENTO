import prisma from "@/lib/db/prisma";
import { getSessionStatus } from "@/lib/utils/getSessionStatus";
import { isValidUUID } from "@/lib/utils/validation";
import { QuestionDto } from "@/types";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  context: RouteContext<"/api/sessions/[sessionId]/questions">,
): Promise<NextResponse<{ data: QuestionDto[] } | { error: string }>> {
  try {
    const { sessionId } = await context.params;
    if (!isValidUUID(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 },
      );
    }
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    const questions = await prisma.question.findMany({
      where: {
        sessionId: sessionId,
      },
    });
    const response: QuestionDto[] = questions.map((q) => ({
      id: q.id,
      content: q.content,
      authorName: q.authorName,
      upvotes: q.upvotes,
      createdAt: q.createdAt.toISOString(),
    }));
    return NextResponse.json({ data: response }, { status: 200 });
  } catch (err) {
    console.error("GET /api/sessions/[sessionId]/questions error: ", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext<"/api/sessions/[sessionId]/questions">,
): Promise<NextResponse<QuestionDto | { error: string }>> {
  try {
    const { sessionId } = await context.params;
    const { content, authorName }: { content: string; authorName: string } =
      await request.json();

    if (!isValidUUID(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 },
      );
    }
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    const isLive = getSessionStatus(session) === "live";
    if (!isLive) {
      return NextResponse.json(
        {
          error: "Questions can only be submitted for live sessions",
        },
        { status: 403 },
      );
    }
    const post = await prisma.question.create({
      data: {
        content: content,
        authorName: authorName,
        sessionId: sessionId,
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
    console.error("POST /api/sessions/[sessionId]/questions error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
      },
    );
  }
}
