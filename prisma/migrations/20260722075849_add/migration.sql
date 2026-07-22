-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "ip" TEXT NOT NULL,
    "service" TEXT NOT NULL DEFAULT 'ssh',
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
