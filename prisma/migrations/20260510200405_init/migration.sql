-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('images', 'video', 'youtube', 'none');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('pending', 'answered', 'archived');

-- CreateEnum
CREATE TYPE "NewsMediaType" AS ENUM ('image', 'videoThumbnail');

-- CreateEnum
CREATE TYPE "LanguageCode" AS ENUM ('en', 'de', 'ar');

-- CreateTable
CREATE TABLE "Mosque" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "facebookUrl" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mosque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerMonthSchedule" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "hijriMonthName" TEXT NOT NULL,
    "hijriYear" INTEGER NOT NULL,
    "gregorianMonth" INTEGER NOT NULL,
    "gregorianYear" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerMonthSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerDaySchedule" (
    "id" TEXT NOT NULL,
    "monthScheduleId" TEXT NOT NULL,
    "gregorianDate" TIMESTAMP(3) NOT NULL,
    "hijriDay" INTEGER NOT NULL,
    "hijriMonthName" TEXT NOT NULL,
    "hijriYear" INTEGER NOT NULL,
    "fajrAdhan" TEXT NOT NULL,
    "fajrIqama" TEXT,
    "sunrise" TEXT NOT NULL,
    "dhuhrAdhan" TEXT NOT NULL,
    "dhuhrIqama" TEXT,
    "asrAdhan" TEXT NOT NULL,
    "asrIqama" TEXT,
    "maghribAdhan" TEXT NOT NULL,
    "maghribIqama" TEXT,
    "ishaAdhan" TEXT NOT NULL,
    "ishaIqama" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerDaySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JumuahSchedule" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "adhanTime" TEXT NOT NULL,
    "iqamaTime" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JumuahSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsPost" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "place" TEXT,
    "mediaType" "MediaType" NOT NULL DEFAULT 'none',
    "videoUrl" TEXT,
    "youtubeId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsMedia" (
    "id" TEXT NOT NULL,
    "newsPostId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "NewsMediaType" NOT NULL DEFAULT 'image',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImamQuestion" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "name" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "status" "QuestionStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answeredAt" TIMESTAMP(3),

    CONSTRAINT "ImamQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppLanguage" (
    "id" TEXT NOT NULL,
    "code" "LanguageCode" NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AppLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PrayerMonthSchedule_mosqueId_hijriYear_hijriMonthName_key" ON "PrayerMonthSchedule"("mosqueId", "hijriYear", "hijriMonthName");

-- CreateIndex
CREATE UNIQUE INDEX "PrayerDaySchedule_monthScheduleId_gregorianDate_key" ON "PrayerDaySchedule"("monthScheduleId", "gregorianDate");

-- CreateIndex
CREATE UNIQUE INDEX "AppLanguage_code_key" ON "AppLanguage"("code");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerMonthSchedule" ADD CONSTRAINT "PrayerMonthSchedule_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerDaySchedule" ADD CONSTRAINT "PrayerDaySchedule_monthScheduleId_fkey" FOREIGN KEY ("monthScheduleId") REFERENCES "PrayerMonthSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JumuahSchedule" ADD CONSTRAINT "JumuahSchedule_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsPost" ADD CONSTRAINT "NewsPost_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsMedia" ADD CONSTRAINT "NewsMedia_newsPostId_fkey" FOREIGN KEY ("newsPostId") REFERENCES "NewsPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImamQuestion" ADD CONSTRAINT "ImamQuestion_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
