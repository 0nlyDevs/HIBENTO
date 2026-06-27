-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('WEBSITE', 'GITHUB', 'TWITTER', 'LINKEDIN', 'FACEBOOK', 'INSTAGRAM', 'OTHER');

-- CreateTable
CREATE TABLE "venue" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "neighborhood" VARCHAR(255) NOT NULL,
    "total_rooms" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "venueId" UUID,
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" UUID NOT NULL,
    "venueId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "capacity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_session" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "roomId" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_session_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "event_session_speaker" (
    "eventSessionId" UUID NOT NULL,
    "speakerId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_session_speaker_pkey" PRIMARY KEY ("eventSessionId","speakerId")
);

-- CreateTable
CREATE TABLE "session_registration" (
    "id" TEXT NOT NULL,
    "eventSessionId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "eventSessionId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "author_name" VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "room_venueId_idx" ON "room"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "room_venueId_name_key" ON "room"("venueId", "name");

-- CreateIndex
CREATE INDEX "event_session_eventId_idx" ON "event_session"("eventId");

-- CreateIndex
CREATE INDEX "event_session_start_time_idx" ON "event_session"("start_time");

-- CreateIndex
CREATE INDEX "event_session_roomId_idx" ON "event_session"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "event_session_roomId_start_time_key" ON "event_session"("roomId", "start_time");

-- CreateIndex
CREATE INDEX "session_registration_eventSessionId_idx" ON "session_registration"("eventSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "session_registration_eventSessionId_email_key" ON "session_registration"("eventSessionId", "email");

-- CreateIndex
CREATE INDEX "question_eventSessionId_idx" ON "question"("eventSessionId");

-- CreateIndex
CREATE INDEX "question_upvotes_idx" ON "question"("upvotes");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session" ADD CONSTRAINT "event_session_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session" ADD CONSTRAINT "event_session_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaker_external_link" ADD CONSTRAINT "speaker_external_link_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "speaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session_speaker" ADD CONSTRAINT "event_session_speaker_eventSessionId_fkey" FOREIGN KEY ("eventSessionId") REFERENCES "event_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session_speaker" ADD CONSTRAINT "event_session_speaker_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "speaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_registration" ADD CONSTRAINT "session_registration_eventSessionId_fkey" FOREIGN KEY ("eventSessionId") REFERENCES "event_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_eventSessionId_fkey" FOREIGN KEY ("eventSessionId") REFERENCES "event_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
