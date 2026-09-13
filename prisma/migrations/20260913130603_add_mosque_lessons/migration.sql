-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('TAHFIZ', 'ARABIC', 'ISLAMIC_STUDIES', 'GENERAL');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "MosqueLesson" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "LessonType" NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "location" TEXT,
    "teacher" TEXT,
    "audience" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MosqueLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MosqueLesson_mosqueId_active_dayOfWeek_startTime_idx" ON "MosqueLesson"("mosqueId", "active", "dayOfWeek", "startTime");

-- AddForeignKey
ALTER TABLE "MosqueLesson" ADD CONSTRAINT "MosqueLesson_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE CASCADE ON UPDATE CASCADE;
