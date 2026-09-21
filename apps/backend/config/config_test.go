package config_test

import (
	"errors"
	"testing"

	"videoStreaming/config"
)

func clearAllEnvs(t *testing.T) {
	t.Helper()
	for _, k := range []string{
		"PORT", "SERVER_PORT", "APP_ENV", "CORS_ALLOWED_ORIGINS",
		"DATABASE_URL", "DB_DSN", "MINIO_ENDPOINT", "MINIO_ACCESS_KEY",
		"MINIO_SECRET_KEY", "MINIO_REGION", "MINIO_BUCKET", "TUS_BASE_PATH",
	} {
		t.Setenv(k, "")
	}
}

func TestDefaultConfig(t *testing.T) {
	clearAllEnvs(t)
	cfg := config.DefaultConfig()
	if cfg.ServerPort != "" {
		t.Errorf("expected empty ServerPort, got %s", cfg.ServerPort)
	}
	if cfg.AppEnv != "" {
		t.Errorf("expected empty AppEnv, got %s", cfg.AppEnv)
	}
	if len(cfg.CORSAllowedOrigins) != 0 {
		t.Errorf("expected empty CORSAllowedOrigins, got %v", cfg.CORSAllowedOrigins)
	}
	if cfg.DB.DSN != "" {
		t.Errorf("expected empty DSN, got %s", cfg.DB.DSN)
	}
	if cfg.MinIO.Endpoint != "" {
		t.Errorf("expected empty MinIO endpoint, got %s", cfg.MinIO.Endpoint)
	}
	if cfg.Tus.BasePath != "" {
		t.Errorf("expected empty Tus BasePath, got %s", cfg.Tus.BasePath)
	}
}

func TestDefaultConfig_WithEnv(t *testing.T) {
	t.Setenv("PORT", "9090")
	t.Setenv("APP_ENV", "production")
	t.Setenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000, http://localhost:5173")
	t.Setenv("DATABASE_URL", "postgres://custom-db:5432/db")
	t.Setenv("MINIO_ENDPOINT", "http://custom-minio:9000")
	t.Setenv("MINIO_ACCESS_KEY", "custom-access")
	t.Setenv("MINIO_SECRET_KEY", "custom-secret")
	t.Setenv("MINIO_REGION", "custom-region")
	t.Setenv("MINIO_BUCKET", "custom-bucket")
	t.Setenv("TUS_BASE_PATH", "/custom-files/")

	cfg := config.DefaultConfig()
	if cfg.ServerPort != ":9090" {
		t.Errorf("expected ServerPort :9090, got %s", cfg.ServerPort)
	}
	if cfg.AppEnv != "production" {
		t.Errorf("expected AppEnv production, got %s", cfg.AppEnv)
	}
	if len(cfg.CORSAllowedOrigins) != 2 || cfg.CORSAllowedOrigins[0] != "http://localhost:3000" ||
		cfg.CORSAllowedOrigins[1] != "http://localhost:5173" {
		t.Errorf(
			"expected CORSAllowedOrigins [http://localhost:3000 http://localhost:5173], got %v",
			cfg.CORSAllowedOrigins,
		)
	}
	if cfg.DB.DSN != "postgres://custom-db:5432/db" {
		t.Errorf("expected DSN postgres://custom-db:5432/db, got %s", cfg.DB.DSN)
	}
	if cfg.MinIO.Endpoint != "http://custom-minio:9000" {
		t.Errorf("expected MinIO Endpoint http://custom-minio:9000, got %s", cfg.MinIO.Endpoint)
	}
	if cfg.MinIO.AccessKey != "custom-access" {
		t.Errorf("expected MinIO AccessKey custom-access, got %s", cfg.MinIO.AccessKey)
	}
	if cfg.MinIO.SecretKey != "custom-secret" {
		t.Errorf("expected MinIO SecretKey custom-secret, got %s", cfg.MinIO.SecretKey)
	}
	if cfg.MinIO.Region != "custom-region" {
		t.Errorf("expected MinIO Region custom-region, got %s", cfg.MinIO.Region)
	}
	if cfg.MinIO.Bucket != "custom-bucket" {
		t.Errorf("expected MinIO Bucket custom-bucket, got %s", cfg.MinIO.Bucket)
	}
	if cfg.Tus.BasePath != "/custom-files/" {
		t.Errorf("expected Tus BasePath /custom-files/, got %s", cfg.Tus.BasePath)
	}
}

func TestGetEnv(t *testing.T) {
	t.Setenv("TEST_KEY", "test_val")
	if val := config.GetEnv("TEST_KEY"); val != "test_val" {
		t.Errorf("expected 'test_val', got %q", val)
	}
	if val := config.GetEnv("NON_EXISTENT_KEY"); val != "" {
		t.Errorf("expected empty string, got %q", val)
	}
}

func TestGetEnvInt(t *testing.T) {
	t.Setenv("INT_KEY", "123")
	val, err := config.GetEnvInt("INT_KEY")
	if err != nil || val != 123 {
		t.Fatalf("expected 123, nil; got %d, %v", val, err)
	}

	val, err = config.GetEnvInt("MISSING_INT")
	if err != nil || val != 0 {
		t.Fatalf("expected 0, nil; got %d, %v", val, err)
	}

	t.Setenv("INVALID_INT", "not-a-number")
	_, err = config.GetEnvInt("INVALID_INT")
	if err == nil || !errors.Is(err, config.ErrInvalidEnv) {
		t.Fatalf("expected ErrInvalidEnv, got %v", err)
	}
}

func TestGetEnvBool(t *testing.T) {
	t.Setenv("BOOL_KEY", "true")
	val, err := config.GetEnvBool("BOOL_KEY")
	if err != nil || !val {
		t.Fatalf("expected true, nil; got %v, %v", val, err)
	}

	val, err = config.GetEnvBool("MISSING_BOOL")
	if err != nil || val {
		t.Fatalf("expected false, nil; got %v, %v", val, err)
	}

	t.Setenv("INVALID_BOOL", "not-a-bool")
	_, err = config.GetEnvBool("INVALID_BOOL")
	if err == nil || !errors.Is(err, config.ErrInvalidEnv) {
		t.Fatalf("expected ErrInvalidEnv, got %v", err)
	}
}

func TestValidateRequiredEnvs(t *testing.T) {
	t.Run("all required envs present", func(t *testing.T) {
		t.Setenv("REQ_A", "val_a")
		t.Setenv("REQ_B", "val_b")

		err := config.ValidateRequiredEnvs("REQ_A", "REQ_B")
		if err != nil {
			t.Fatalf("expected no error, got: %v", err)
		}
	})

	t.Run("missing required envs", func(t *testing.T) {
		t.Setenv("REQ_A", "val_a")

		err := config.ValidateRequiredEnvs("REQ_A", "MISSING_REQ_KEY")
		if err == nil || !errors.Is(err, config.ErrRequiredEnvMissing) {
			t.Fatalf("expected ErrRequiredEnvMissing, got: %v", err)
		}
	})
}

func TestNewConfig(t *testing.T) {
	t.Run("fails when required envs missing", func(t *testing.T) {
		clearAllEnvs(t)
		_, err := config.NewConfig()
		if err == nil || !errors.Is(err, config.ErrRequiredEnvMissing) {
			t.Fatalf("expected ErrRequiredEnvMissing, got: %v", err)
		}
	})

	t.Run("succeeds when all required envs present", func(t *testing.T) {
		clearAllEnvs(t)
		for _, key := range config.RequiredEnvKeys() {
			t.Setenv(key, "test_value")
		}
		cfg, err := config.NewConfig()
		if err != nil {
			t.Fatalf("expected nil error, got: %v", err)
		}
		if cfg.DB.DSN != "test_value" {
			t.Errorf("expected DSN test_value, got %s", cfg.DB.DSN)
		}
	})
}
