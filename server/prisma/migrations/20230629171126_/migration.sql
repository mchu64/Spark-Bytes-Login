-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEventOwner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT;
