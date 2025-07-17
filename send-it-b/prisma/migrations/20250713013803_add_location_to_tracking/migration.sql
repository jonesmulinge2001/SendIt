/*
  Warnings:

  - Added the required column `location` to the `ParcelTrackingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParcelTrackingHistory" ADD COLUMN     "location" TEXT NOT NULL;
