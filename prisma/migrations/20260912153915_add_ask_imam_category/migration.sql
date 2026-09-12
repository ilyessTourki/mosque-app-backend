-- CreateEnum
CREATE TYPE "AskImamCategory" AS ENUM ('SHARIA', 'PERSONAL_GUIDANCE', 'COMPLAINT');

-- AlterTable
ALTER TABLE "ImamQuestion" ADD COLUMN     "category" "AskImamCategory" NOT NULL DEFAULT 'SHARIA';
