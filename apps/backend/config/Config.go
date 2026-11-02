package config

import (
	"strings"
)

type Config struct {
	ServerPort         string
	AppEnv             string
	CORSAllowedOrigins []string
	MinIO              MinIOConfig
	Tus                TusConfig
	DB                 DBConfig
	Redis              RedisConfig
	JWT                JWTConfig
}

type DBConfig struct {
	DSN string
}

type RedisConfig struct {
	Addr     string
	Password string
	DB       int
}

type JWTConfig struct {
	Secret     string
	BFFSecret  string
	UserSecret string
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

func parseStringSlice(s string) []string {
	if s == "" {
		return nil
	}
	var res []string
	for p := range strings.SplitSeq(s, ",") {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			res = append(res, trimmed)
		}
	}
	return res
}

// DefaultConfig returns the default configuration loaded with environment variable overrides.
func DefaultConfig() Config {
	port := GetEnv("PORT")
	if port != "" && !strings.Contains(port, ":") {
		port = ":" + port
	}

	return Config{
		ServerPort:         port,
		AppEnv:             GetEnv("APP_ENV"),
		CORSAllowedOrigins: parseStringSlice(GetEnv("CORS_ALLOWED_ORIGINS")),
		DB: DBConfig{
			DSN: GetEnv("DATABASE_URL"),
		},
		MinIO: MinIOConfig{
			Endpoint:  GetEnv("MINIO_ENDPOINT"),
			AccessKey: GetEnv("MINIO_ACCESS_KEY"),
			SecretKey: GetEnv("MINIO_SECRET_KEY"),
			Region:    GetEnv("MINIO_REGION"),
			Bucket:    GetEnv("MINIO_BUCKET"),
		},
		Tus: TusConfig{
			BasePath: GetEnv("TUS_BASE_PATH"),
		},
		Redis: RedisConfig{
			Addr:     GetEnv("REDIS_ADDR"),
			Password: GetEnv("REDIS_PASSWORD"),
			DB:       0,
		},
		JWT: JWTConfig{
			Secret:     GetEnv("JWT_SECRET"),
			BFFSecret:  GetEnv("BFF_JWT_SECRET"),
			UserSecret: GetEnv("USER_JWT_SECRET"),
		},
	}
}

// NewConfig validates required environment variables and returns Config.
func NewConfig() (Config, error) {
	if err := Validate(); err != nil {
		return Config{}, err
	}
	return DefaultConfig(), nil
}
