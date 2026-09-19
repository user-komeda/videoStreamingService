-- Create "videos" table
CREATE TABLE "public"."videos" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "owner_id" uuid NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "visibility" text NOT NULL DEFAULT 'private',
  "status" text NOT NULL DEFAULT 'notReady',
  "file_path" text NOT NULL,
  "file_size" bigint NOT NULL DEFAULT 0,
  "mime_type" text NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "chk_videos_file_size" CHECK (file_size >= 0),
  CONSTRAINT "chk_videos_status" CHECK (status = ANY (ARRAY['notReady'::text, 'ready'::text])),
  CONSTRAINT "chk_videos_visibility" CHECK (visibility = ANY (ARRAY['public'::text, 'private'::text]))
);
-- Create index "idx_videos_owner_id" to table: "videos"
CREATE INDEX "idx_videos_owner_id" ON "public"."videos" ("owner_id");
