/*
  Warnings:

  - You are about to drop the column `isEventOwner` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isEventOwner",
ADD COLUMN     "canPostEvents" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
