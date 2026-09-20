
data "external_schema" "gorm" {
  program = [
    "go",
    "run",
    "-mod=mod",
    "./db/loader",
  ]
}

env "local" {
  src = data.external_schema.gorm.url


  dev = "docker://postgres/16/dev"
  url = getenv("DATABASE_URL")

  migration {
    dir = "file://./db/migration"
  }
}
