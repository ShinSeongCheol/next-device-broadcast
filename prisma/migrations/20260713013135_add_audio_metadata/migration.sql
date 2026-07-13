/*
  Warnings:

  - You are about to drop the column `genre` on the `audio_common` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_audio_common" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "audio_id" INTEGER NOT NULL,
    "title" TEXT,
    "artist" TEXT,
    "album" TEXT,
    "year" INTEGER,
    CONSTRAINT "audio_common_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "audio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_audio_common" ("album", "artist", "audio_id", "id", "title", "year") SELECT "album", "artist", "audio_id", "id", "title", "year" FROM "audio_common";
DROP TABLE "audio_common";
ALTER TABLE "new_audio_common" RENAME TO "audio_common";
CREATE UNIQUE INDEX "audio_common_audio_id_key" ON "audio_common"("audio_id");
CREATE TABLE "new_audio_format" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "audio_id" INTEGER NOT NULL,
    "container" TEXT,
    "codec" TEXT,
    "sample_rate" INTEGER,
    "number_of_channels" INTEGER,
    "bitrate" INTEGER,
    "duration" REAL,
    CONSTRAINT "audio_format_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "audio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_audio_format" ("audio_id", "bitrate", "codec", "container", "duration", "id", "number_of_channels", "sample_rate") SELECT "audio_id", "bitrate", "codec", "container", "duration", "id", "number_of_channels", "sample_rate" FROM "audio_format";
DROP TABLE "audio_format";
ALTER TABLE "new_audio_format" RENAME TO "audio_format";
CREATE UNIQUE INDEX "audio_format_audio_id_key" ON "audio_format"("audio_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
