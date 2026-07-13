-- CreateTable
CREATE TABLE "audio_format" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "audio_id" INTEGER NOT NULL,
    "container" TEXT NOT NULL,
    "codec" TEXT NOT NULL,
    "sample_rate" INTEGER NOT NULL,
    "number_of_channels" INTEGER NOT NULL,
    "bitrate" INTEGER NOT NULL,
    "duration" REAL NOT NULL,
    CONSTRAINT "audio_format_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "audio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audio_common" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "audio_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    CONSTRAINT "audio_common_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "audio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "audio_format_audio_id_key" ON "audio_format"("audio_id");

-- CreateIndex
CREATE UNIQUE INDEX "audio_common_audio_id_key" ON "audio_common"("audio_id");
