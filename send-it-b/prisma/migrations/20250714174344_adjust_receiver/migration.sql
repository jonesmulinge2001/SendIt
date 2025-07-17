/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Parcel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Parcel" DROP CONSTRAINT "Parcel_receiverId_fkey";

-- AlterTable
ALTER TABLE "Parcel" DROP COLUMN "receiverId",
ADD COLUMN     "receiverEmail" TEXT,
ADD COLUMN     "receiverName" TEXT;
