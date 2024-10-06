-- CreateTable
CREATE TABLE "Preference" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_userPreferences" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Preference_name_key" ON "Preference"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_userPreferences_AB_unique" ON "_userPreferences"("A", "B");

-- CreateIndex
CREATE INDEX "_userPreferences_B_index" ON "_userPreferences"("B");

-- AddForeignKey
ALTER TABLE "_userPreferences" ADD CONSTRAINT "_userPreferences_A_fkey" FOREIGN KEY ("A") REFERENCES "Preference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userPreferences" ADD CONSTRAINT "_userPreferences_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
