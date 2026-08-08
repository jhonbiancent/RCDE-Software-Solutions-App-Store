ALTER TABLE "App" RENAME COLUMN "categories" TO "platforms";
ALTER TABLE "App" ADD COLUMN "categories" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
