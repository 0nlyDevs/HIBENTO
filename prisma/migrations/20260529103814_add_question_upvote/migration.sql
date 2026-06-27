-- CreateTable
CREATE TABLE "question_upvote" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "visitor_id" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_upvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "question_upvote_questionId_idx" ON "question_upvote"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "question_upvote_questionId_visitor_id_key" ON "question_upvote"("questionId", "visitor_id");

-- AddForeignKey
ALTER TABLE "question_upvote" ADD CONSTRAINT "question_upvote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
