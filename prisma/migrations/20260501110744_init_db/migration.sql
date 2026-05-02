-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('WEBSITE', 'GITHUB', 'TWITTER', 'LINKEDIN', 'FACEBOOK', 'INSTAGRAM', 'OTHER');

-- CreateTable
CREATE TABLE "event" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "location" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaker" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "avatar_url" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "speaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaker_external_link" (
    "id" UUID NOT NULL,
    "speakerId" UUID NOT NULL,
    "link_type" "LinkType" NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speaker_external_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "roomId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_speaker" (
    "sessionId" UUID NOT NULL,
    "speakerId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_speaker_pkey" PRIMARY KEY ("sessionId","speakerId")
);

-- CreateTable
CREATE TABLE "question" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "author_name" VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "room_eventId_idx" ON "room"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "room_eventId_name_key" ON "room"("eventId", "name");

-- CreateIndex
CREATE INDEX "session_eventId_idx" ON "session"("eventId");

-- CreateIndex
CREATE INDEX "session_start_time_idx" ON "session"("start_time");

-- CreateIndex
CREATE INDEX "session_roomId_idx" ON "session"("roomId");

-- CreateIndex
CREATE INDEX "question_sessionId_idx" ON "question"("sessionId");

-- CreateIndex
CREATE INDEX "question_upvotes_idx" ON "question"("upvotes");

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaker_external_link" ADD CONSTRAINT "speaker_external_link_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "speaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_speaker" ADD CONSTRAINT "session_speaker_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_speaker" ADD CONSTRAINT "session_speaker_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "speaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
