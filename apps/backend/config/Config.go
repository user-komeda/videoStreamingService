package config

type Config struct {
	ServerPort string
	MinIO      MinIOConfig
	Tus        TusConfig
	DB         DBConfig
}
type DBConfig struct {
	// DSN example (MySQL):
	//   user:pass@tcp(127.0.0.1:3306)/app?parseTime=true&loc=Local
	DSN string
}
type MinIOConfig struct {
	Endpoint  string
	AccessKey string
	SecretKey string
	Region    string
	Bucket    string
}

type TusConfig struct {
	BasePath string
}

func DefaultConfig() Config {
	return Config{
		ServerPort: ":8080",
		DB: DBConfig{
			DSN: "postgres://postgres:password@localhost:5432/sample_db?sslmode=disable",
		},
		MinIO: MinIOConfig{
			Endpoint:  "http://192.168.11.8:9000",
			AccessKey: "minio",
			SecretKey: "wFKcEQAEafHLWjTWEmK5",
			Region:    "us-east-1",
			Bucket:    "tus-uploads",
		},
		Tus: TusConfig{
			BasePath: "/files/",
		},
	}
}
