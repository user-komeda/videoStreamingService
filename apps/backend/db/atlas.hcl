
data "external_schema" "gorm" {
  program = [
    "go",
    "run",
    "-mod=mod",
    "ariga.io/atlas-provider-gorm",
    "load",
    "--path",
    "./db/schema",
    "--dialect",
    "postgres",
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
