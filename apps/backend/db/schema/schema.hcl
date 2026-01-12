schema "public" {}

table "uploads" {
  schema = schema.public

  column "id" {
    type = uuid
    default = sql("gen_random_uuid()")
  }

  column "tus_id" {
    type = text
    null = false
  }

  column "filename" {
    type = text
    null = false
  }

  column "status" {
    type = text
    null = false
  }

  primary_key {
    columns = [column.id]
  }

  index "uploads_tus_id_key" {
    unique = true
    columns = [column.tus_id]
  }
}