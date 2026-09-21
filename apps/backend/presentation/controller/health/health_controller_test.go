package health_test

import (
	"cmp"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"videoStreaming/app"
	"videoStreaming/config"
	"videoStreaming/presentation/controller/health"
)

func setupTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	dsn := cmp.Or(
		config.GetEnv("DATABASE_URL"),
		config.GetEnv("DB_DSN"),
		config.DefaultConfig().DB.DSN,
	)

	db, err := app.NewGormDB(config.DBConfig{DSN: dsn})
	if err != nil {
		t.Skipf("skipping test: database connection failed: %v", err)
	}

	sqlDB, pingErr := db.DB()
	if pingErr != nil || sqlDB.Ping() != nil {
		t.Skipf("skipping test: cannot ping database")
	}

	return db
}

func TestHealthController_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)

	ctrl := health.NewController(db)
	if ctrl == nil {
		t.Fatal("expected non-nil controller")
	}

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequestWithContext(t.Context(), http.MethodGet, "/health", nil)

	ctrl.Check(c)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200 OK, got %d", w.Code)
	}

	var res map[string]string
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to unmarshal body: %v", err)
	}
	if res["status"] != "ok" {
		t.Errorf("expected status ok, got %s", res["status"])
	}
	if res["db"] != "connected" {
		t.Errorf("expected db connected, got %s", res["db"])
	}
}

func TestHealthController_NilDB(t *testing.T) {
	gin.SetMode(gin.TestMode)
	ctrl := health.NewController(nil)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequestWithContext(t.Context(), http.MethodGet, "/health", nil)

	ctrl.Check(c)

	if w.Code != http.StatusServiceUnavailable {
		t.Errorf("expected 503 Service Unavailable, got %d", w.Code)
	}
}

func TestHealthController_DBUnreachable(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db, err := app.NewGormDB(config.DBConfig{DSN: config.DefaultConfig().DB.DSN})
	if err != nil {
		t.Skipf("skipping test: failed to create db config: %v", err)
	}

	if sqlDB, err := db.DB(); err == nil {
		_ = sqlDB.Close()
	}

	ctrl := health.NewController(db)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequestWithContext(t.Context(), http.MethodGet, "/health", nil)

	ctrl.Check(c)

	if w.Code != http.StatusServiceUnavailable {
		t.Errorf("expected 503 Service Unavailable, got %d", w.Code)
	}
}

func TestHealthController_FailedToGetDB(t *testing.T) {
	gin.SetMode(gin.TestMode)
	// Config を初期化し、ConnPool が未設定（nil）の状態にすることで安全に c.db.DB() のエラー分岐を発生させる
	ctrl := health.NewController(&gorm.DB{Config: &gorm.Config{}})

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequestWithContext(t.Context(), http.MethodGet, "/health", nil)

	ctrl.Check(c)

	if w.Code != http.StatusServiceUnavailable {
		t.Errorf("expected 503 Service Unavailable, got %d", w.Code)
	}

	var res map[string]string
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to unmarshal body: %v", err)
	}
	if res["error"] != "failed to get database instance" {
		t.Errorf("expected error 'failed to get database instance', got %s", res["error"])
	}
}
