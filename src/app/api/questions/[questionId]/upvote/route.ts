import prisma from "@/lib/db/prisma";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";
import type { UpvoteResponseDto } from "@/types/dto";
import { NextResponse } from "next/server";

export async function POST(
  _: Request,
  context: RouteContext<"/api/questions/[questionId]/upvote">
): Promise<NextResponse<UpvoteResponseDto | { error: string }>> {
  try {
    const { questionId } = await context.params;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const session = await prisma.eventSession.findUnique({
      where: { id: question.eventSessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session does not exist" },
        { status: 404 }
      );
    }

    const isLive = getEventSessionStatus(session) === "live";
    if (!isLive) {
      return NextResponse.json(
        {
          error: "Question can only be upvoted when session is live",
        },
        { status: 403 }
      );
    }

    const updated = await prisma.question.update({
      where: { id: questionId },
      data: { upvotes: { increment: 1 } },
    });

    return NextResponse.json({ success: true, upvotes: updated.upvotes });
  } catch (err) {
    console.error("POST /api/questions/[questionId]/upvote error: ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}