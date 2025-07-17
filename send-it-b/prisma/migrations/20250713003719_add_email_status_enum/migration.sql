-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('SENT', 'FAILED', 'PENDING');

-- AlterTable
ALTER TABLE "EmailNotification" ALTER COLUMN "status" SET DEFAULT 'SENT';
