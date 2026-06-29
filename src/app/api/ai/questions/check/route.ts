import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { generateEmbedding, generateBatchEmbeddings, cosineSimilarity } from "@/ai";
import type { DuplicateCheckResponseDto } from "@/types/dto";

const SIMILARITY_THRESHOLD = 0.85;

export async function POST(
  request: NextRequest,
): Promise<
  NextResponse<{ data: DuplicateCheckResponseDto } | { error: string }>
> {
  try {
    const body = await request.json();
    const { sessionId, content } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "'sessionId' is required" },
        { status: 400 },
      );
    }
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "'content' is required" },
        { status: 400 },
      );
    }

    const trimmed = content.trim();

    const existingQuestions = await prisma.question.findMany({
      where: { eventSessionId: sessionId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    if (existingQuestions.length === 0) {
      return NextResponse.json(
        {
          data: {
            isDuplicate: false,
            similarity: 0,
            similarQuestion: null,
          },
        },
        { status: 200 },
      );
    }

    const queryVec = await generateEmbedding(trimmed);

    const existingTexts = existingQuestions.map((q) => q.content);
    const existingVecs = await generateBatchEmbeddings(existingTexts);

    let bestScore = 0;
    let bestIndex = -1;

    for (let i = 0; i < existingVecs.length; i++) {
      const score = cosineSimilarity(queryVec, existingVecs[i]);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    if (bestScore >= SIMILARITY_THRESHOLD) {
      const match = existingQuestions[bestIndex];
      return NextResponse.json(
        {
          data: {
            isDuplicate: true,
            similarity: Math.round(bestScore * 1000) / 1000,
            similarQuestion: {
              id: match.id,
              content: match.content,
              authorName: match.authorName,
              upvotes: match.upvotes,
              createdAt: match.createdAt.toISOString(),
            },
          },
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        data: {
          isDuplicate: false,
          similarity: Math.round(bestScore * 1000) / 1000,
          similarQuestion: null,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("POST /api/ai/questions/check error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
