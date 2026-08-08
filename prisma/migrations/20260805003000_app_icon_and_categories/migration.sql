ALTER TABLE "App" ADD COLUMN "categories" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "App" ADD COLUMN "iconUrl" TEXT;

UPDATE "App"
SET "categories" = ARRAY[
  CASE "category"::TEXT
    WHEN 'WEB_APP' THEN 'WebApp'
    WHEN 'DESKTOP_APP' THEN 'Windows'
    WHEN 'WEBSITE' THEN 'Website'
    WHEN 'MOBILE_APP' THEN 'Android'
    WHEN 'LIBRARY_TOOL' THEN 'Library/Tool'
    ELSE "category"::TEXT
  END
];

DROP INDEX IF EXISTS "App_category_idx";
ALTER TABLE "App" DROP COLUMN "category";
DROP TYPE IF EXISTS "AppCategory";
