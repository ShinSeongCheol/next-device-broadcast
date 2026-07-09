/*
  Warnings:

  - You are about to drop the `audio_device` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "audio_device_deviceId_card_index_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "audio_device";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "audio_card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "deviceId" INTEGER NOT NULL,
    "card_index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "audio_card_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "device" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_mixer_control" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "audioCardId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "volume" INTEGER NOT NULL DEFAULT 50,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "mixer_control_audioCardId_fkey" FOREIGN KEY ("audioCardId") REFERENCES "audio_card" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_mixer_control" ("audioCardId", "created_at", "id", "name", "updated_at", "volume") SELECT "audioCardId", "created_at", "id", "name", "updated_at", "volume" FROM "mixer_control";
DROP TABLE "mixer_control";
ALTER TABLE "new_mixer_control" RENAME TO "mixer_control";
CREATE UNIQUE INDEX "mixer_control_audioCardId_name_key" ON "mixer_control"("audioCardId", "name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "audio_card_deviceId_card_index_key" ON "audio_card"("deviceId", "card_index");
