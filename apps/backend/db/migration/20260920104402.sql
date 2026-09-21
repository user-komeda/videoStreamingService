-- Modify "videos" table
ALTER TABLE "public"."videos" ALTER COLUMN "owner_id" SET DEFAULT gen_random_uuid();
