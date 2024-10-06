/*
  Warnings:

  - You are about to drop the `_EventToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tag_id` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_EventToTag" DROP CONSTRAINT "_EventToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToTag" DROP CONSTRAINT "_EventToTag_B_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "tag_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "room" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "_EventToTag";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("tag_id") ON DELETE RESTRICT ON UPDATE CASCADE;
