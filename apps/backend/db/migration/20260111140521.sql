-- Create "uploads" table
CREATE TABLE "public"."uploads" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "tus_id" text NOT NULL,
  "filename" text NOT NULL,
  "status" text NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "uploads_tus_id_key" to table: "uploads"
CREATE UNIQUE INDEX "uploads_tus_id_key" ON "public"."uploads" ("tus_id");
