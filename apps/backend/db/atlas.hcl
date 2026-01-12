
env "local" {
  src = "file://./db/schema/schema.hcl"

  dev = "postgres://localhost:5432/sample_db_dev?sslmode=disable"
  url = "postgres://localhost:5432/sample_db?sslmode=disable"

  migration {
    dir = "file://./db/migration"
  }
}
