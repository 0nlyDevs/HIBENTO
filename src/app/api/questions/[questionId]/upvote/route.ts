import prisma from "@/lib/db/prisma";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";
import type { UpvoteResponseDto } from "@/types/dto";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
): Promise<NextResponse<UpvoteResponseDto | { error: string }>> {
  try {
    const { questionId } = await params;

    let visitorId: string | undefined;
    try {
      const body = await request.json();
      visitorId = body?.visitorId;
    } catch {
    }

    if (!visitorId || typeof visitorId !== "string" || visitorId.length > 64) {
      return NextResponse.json(
        { error: "visitorId is required" },
        { status: 400 }
      );
    }

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
        { error: "Question can only be upvoted when session is live" },
        { status: 403 }
      );
    }

    const existingUpvote = await prisma.questionUpvote.findUnique({
      where: {
        questionId_visitorId: {
          questionId,
          visitorId,
        },
      },
    });

    if (existingUpvote) {
      await prisma.$transaction([
        prisma.questionUpvote.delete({
          where: {
            questionId_visitorId: {
              questionId,
              visitorId,
            },
          },
        }),
        prisma.question.update({
          where: { id: questionId },
          data: { upvotes: { decrement: 1 } },
        }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.questionUpvote.create({
          data: { questionId, visitorId },
        }),
        prisma.question.update({
          where: { id: questionId },
          data: { upvotes: { increment: 1 } },
        }),
      ]);
    }

    const result = await prisma.question.findUnique({
      where: { id: questionId },
      select: { upvotes: true },
    });

    return NextResponse.json(
      { success: true, upvotes: result!.upvotes },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/questions/[questionId]/upvote error: ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
