/*
  Warnings:

  - Made the column `receiverEmail` on table `Parcel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiverName` on table `Parcel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senderEmail` on table `Parcel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senderName` on table `Parcel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Parcel" ALTER COLUMN "receiverEmail" SET NOT NULL,
ALTER COLUMN "receiverName" SET NOT NULL,
ALTER COLUMN "senderEmail" SET NOT NULL,
ALTER COLUMN "senderName" SET NOT NULL;
