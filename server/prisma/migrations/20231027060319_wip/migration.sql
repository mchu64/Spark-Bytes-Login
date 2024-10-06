/*
  Warnings:

  - You are about to drop the `Preference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userPreferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_userPreferences" DROP CONSTRAINT "_userPreferences_A_fkey";

-- DropForeignKey
ALTER TABLE "_userPreferences" DROP CONSTRAINT "_userPreferences_B_fkey";

-- DropTable
DROP TABLE "Preference";

-- DropTable
DROP TABLE "_userPreferences";
