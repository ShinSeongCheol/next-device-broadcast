-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_mixer_control" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "audioCardId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "volume" TEXT NOT NULL DEFAULT 'off',
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
