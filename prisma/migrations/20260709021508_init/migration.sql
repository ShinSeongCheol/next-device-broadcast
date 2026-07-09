-- CreateTable
CREATE TABLE "audio_device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "deviceId" INTEGER NOT NULL,
    "card_index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "audio_device_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "device" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "mixer_control" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "audioCardId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "volume" INTEGER NOT NULL DEFAULT 50,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "mixer_control_audioCardId_fkey" FOREIGN KEY ("audioCardId") REFERENCES "audio_device" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_audio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_audio" ("created_at", "extension", "id", "original_name", "path", "updated_at", "uuid") SELECT "created_at", "extension", "id", "original_name", "path", "updated_at", "uuid" FROM "audio";
DROP TABLE "audio";
ALTER TABLE "new_audio" RENAME TO "audio";
CREATE UNIQUE INDEX "audio_uuid_key" ON "audio"("uuid");
CREATE TABLE "new_device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "health_status" TEXT,
    "last_health_time" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_device" ("created_at", "health_status", "id", "ip", "last_health_time", "name", "password", "port", "updated_at", "username") SELECT "created_at", "health_status", "id", "ip", "last_health_time", "name", "password", "port", "updated_at", "username" FROM "device";
DROP TABLE "device";
ALTER TABLE "new_device" RENAME TO "device";
CREATE UNIQUE INDEX "device_ip_key" ON "device"("ip");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "audio_device_deviceId_card_index_key" ON "audio_device"("deviceId", "card_index");

-- CreateIndex
CREATE UNIQUE INDEX "mixer_control_audioCardId_name_key" ON "mixer_control"("audioCardId", "name");
