package app_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"videoStreaming/app"
	"videoStreaming/config"

	"github.com/gin-gonic/gin"
	"go.uber.org/fx/fxtest"
)

func TestNewAppContext(t *testing.T) {
	lc := fxtest.NewLifecycle(t)
	appCtx := app.NewAppContext(lc)
	if appCtx.Context == nil {
		t.Fatal("expected non-nil context")
	}

	if err := lc.Start(t.Context()); err != nil {
		t.Fatalf("failed to start lifecycle: %v", err)
	}

	if err := lc.Stop(t.Context()); err != nil {
		t.Fatalf("failed to stop lifecycle: %v", err)
	}

	select {
	case <-appCtx.Done():
		// successfully cancelled
	default:
		t.Fatal("expected context to be cancelled after lifecycle stop")
	}
}

func TestNewGinEngine(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("with allowed origins configured", func(t *testing.T) {
		cfg := config.Config{
			CORSAllowedOrigins: []string{"http://localhost:5173"},
		}
		engine := app.NewGinEngine(cfg)
		if engine == nil {
			t.Fatal("expected non-nil engine")
		}
		if engine.RedirectTrailingSlash {
			t.Errorf("expected RedirectTrailingSlash to be false")
		}

		engine.OPTIONS("/files", func(c *gin.Context) {
			c.Status(204)
		})

		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodOptions, "/files", nil)
		req.Header.Set("Origin", "http://localhost:5173")
		req.Header.Set("Access-Control-Request-Method", "POST")
		req.Header.Set("Access-Control-Request-Headers", "Upload-Length,Upload-Metadata")
		engine.ServeHTTP(w, req)

		if w.Code != http.StatusNoContent && w.Code != http.StatusOK {
			t.Errorf("expected 204 or 200 on OPTIONS preflight, got %d", w.Code)
		}
		allowHeaders := w.Header().Get("Access-Control-Allow-Headers")
		if allowHeaders == "" {
			t.Errorf("expected Access-Control-Allow-Headers to be set")
		}
	})

	t.Run("with empty allowed origins (allow all)", func(t *testing.T) {
		cfg := config.Config{
			CORSAllowedOrigins: nil,
		}
		engine := app.NewGinEngine(cfg)
		if engine == nil {
			t.Fatal("expected non-nil engine")
		}

		engine.OPTIONS("/files", func(c *gin.Context) {
			c.Status(204)
		})

		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodOptions, "/files", nil)
		req.Header.Set("Origin", "http://example.com")
		req.Header.Set("Access-Control-Request-Method", "GET")
		engine.ServeHTTP(w, req)

		if w.Code != http.StatusNoContent && w.Code != http.StatusOK {
			t.Errorf("expected 204 or 200 on OPTIONS preflight, got %d", w.Code)
		}
	})
}

func TestRegisterHTTPServer(t *testing.T) {
	lc := fxtest.NewLifecycle(t)
	cfg := config.Config{
		ServerPort:         ":0",
		AppEnv:             "test",
		CORSAllowedOrigins: nil,
		MinIO:              config.MinIOConfig{},
		Tus:                config.TusConfig{},
		DB:                 config.DBConfig{},
	}
	r := gin.New()
	app.RegisterHTTPServer(lc, cfg, r)

	if err := lc.Start(t.Context()); err != nil {
		t.Fatalf("failed to start server: %v", err)
	}

	if err := lc.Stop(t.Context()); err != nil {
		t.Fatalf("failed to stop server: %v", err)
	}
}

func TestNewGormDB(t *testing.T) {
	cfg := config.DBConfig{
		DSN: "host=localhost user=postgres password=password dbname=sample_db port=5432 sslmode=disable",
	}
	db, err := app.NewGormDB(cfg)
	if err != nil {
		t.Fatalf("failed to create gorm db: %v", err)
	}
	if db == nil {
		t.Fatal("expected db to be non-nil")
	}
}
