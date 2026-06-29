import prisma from "@/lib/db/prisma";
import type { QuestionDto } from "@/types/dto";
import { NextResponse } from "next/server";
import { isValidUUID } from "@/lib/utils/validation";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ questionId: string }> }
): Promise<NextResponse<{ data: QuestionDto } | { error: string }>> {
  try {
    const { questionId } = await params;

    if (!isValidUUID(questionId)) {
      return NextResponse.json(
        { error: "Invalid question ID format" },
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

    return NextResponse.json({
      data: {
        id: question.id,
        content: question.content,
        authorName: question.authorName,
        upvotes: question.upvotes,
        createdAt: question.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("GET /api/questions/[questionId] error: ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
