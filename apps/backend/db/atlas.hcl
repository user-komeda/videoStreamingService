
env "local" {
  src = "file://./db/schema/schema.hcl"

  dev = "postgres://postgres:password@localhost:5432/sample_db_dev?sslmode=disable"
  url = "postgres://postgres:password@localhost:5432/sample_db?sslmode=disable"

  migration {
    dir = "file://./db/migration"
  }
}
