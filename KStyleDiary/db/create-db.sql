CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

BEGIN TRANSACTION;

CREATE TABLE "Looks" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Looks" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Description" TEXT NULL,
    "Mood" TEXT NULL,
    "CreatingDate" TEXT NOT NULL,
    "OwnerId" INTEGER NOT NULL
);

CREATE TABLE "Products" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Products" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Brand" TEXT NULL,
    "Category" TEXT NOT NULL,
    "Country" TEXT NULL,
    "Price" TEXT NULL
);

CREATE TABLE "LookProducts" (
    "LookId" INTEGER NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "UsageNote" TEXT NULL,
    "Rating" INTEGER NULL,
    CONSTRAINT "PK_LookProducts" PRIMARY KEY ("LookId", "ProductId"),
    CONSTRAINT "FK_LookProducts_Looks_LookId" FOREIGN KEY ("LookId") REFERENCES "Looks" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_LookProducts_Products_ProductId" FOREIGN KEY ("ProductId") REFERENCES "Products" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_LookProducts_ProductId" ON "LookProducts" ("ProductId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20251225170334_InitialCreate', '8.0.11');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "Users" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Users" PRIMARY KEY AUTOINCREMENT,
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Role" TEXT NOT NULL,
    "CreatedAt" TEXT NOT NULL
);

CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260104184141_AddUsers', '8.0.11');

COMMIT;

BEGIN TRANSACTION;

ALTER TABLE "Looks" ADD "IsPublic" INTEGER NOT NULL DEFAULT 0;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260104194754_AddLookIsPublic', '8.0.11');

COMMIT;

