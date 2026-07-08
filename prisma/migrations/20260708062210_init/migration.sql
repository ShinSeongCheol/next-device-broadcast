-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_device" ("id", "ip", "name", "password", "port", "username") SELECT "id", "ip", "name", "password", "port", "username" FROM "device";
DROP TABLE "device";
ALTER TABLE "new_device" RENAME TO "device";
CREATE UNIQUE INDEX "device_ip_key" ON "device"("ip");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
