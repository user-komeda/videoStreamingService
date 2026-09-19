-- Modify "videos" table
ALTER TABLE "public"."videos" ADD CONSTRAINT "chk_videos_duration_ms" CHECK (duration_ms >= 0), ADD COLUMN "duration_ms" bigint NOT NULL DEFAULT 0;
