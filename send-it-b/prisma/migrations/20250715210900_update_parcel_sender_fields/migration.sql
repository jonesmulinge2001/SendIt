/*
  Warnings:

  - You are about to drop the column `senderId` on the `Parcel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Parcel" DROP CONSTRAINT "Parcel_senderId_fkey";

-- AlterTable
ALTER TABLE "Parcel" DROP COLUMN "senderId",
ADD COLUMN     "senderEmail" TEXT,
ADD COLUMN     "senderName" TEXT;
