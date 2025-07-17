/*
  Warnings:

  - Added the required column `status` to the `EmailNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailNotification" ADD COLUMN     "status" TEXT NOT NULL;
