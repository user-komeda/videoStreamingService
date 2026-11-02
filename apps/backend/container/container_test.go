package container_test

import (
	"testing"

	"videoStreaming/config"
	"videoStreaming/container"

	"go.uber.org/fx"
	"go.uber.org/fx/fxtest"
)

func TestNewLogger(t *testing.T) {
	logger := container.NewLogger()
	if logger == nil {
		t.Fatal("expected non-nil logger")
	}
}

func TestModules(t *testing.T) {
	if container.CoreModule() == nil {
		t.Fatal("expected non-nil CoreModule")
	}
	if container.LibModule() == nil {
		t.Fatal("expected non-nil LibModule")
	}
	if container.RepositoryModule() == nil {
		t.Fatal("expected non-nil RepositoryModule")
	}
	if container.ApplicationModule() == nil {
		t.Fatal("expected non-nil ApplicationModule")
	}
	if container.PresentationModule() == nil {
		t.Fatal("expected non-nil PresentationModule")
	}
	if container.App() == nil {
		t.Fatal("expected non-nil App")
	}
}

func TestAppGraph(t *testing.T) {
	for key, val := range map[string]string{
		"DATABASE_URL":     "postgres://postgres:password@localhost:5432/sample_db?sslmode=disable",
		"MINIO_ENDPOINT":   "http://localhost:9000",
		"MINIO_ACCESS_KEY": "test_access",
		"MINIO_SECRET_KEY": "test_secret",
		"MINIO_REGION":     "us-east-1",
		"MINIO_BUCKET":     "test_bucket",
		"TUS_BASE_PATH":    "/files/",
		"REDIS_ADDR":       "localhost:6379",
		"REDIS_PASSWORD":   "test_password",
		"BFF_JWT_SECRET":   "bff-test-secret-12345",
		"USER_JWT_SECRET":  "user-test-secret-12345",
	} {
		t.Setenv(key, val)
	}

	app := fxtest.New(
		t,
		container.App(),
		fx.Invoke(func(jwtCfg config.JWTConfig) {
			if jwtCfg.BFFSecret == "" {
				t.Error("expected non-empty BFFSecret")
			}
		}),
		fx.NopLogger,
	)
	if err := app.Err(); err != nil {
		t.Fatalf("failed to build app graph: %v", err)
	}
}
