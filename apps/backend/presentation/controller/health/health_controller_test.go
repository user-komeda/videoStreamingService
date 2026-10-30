package health_test

import (
	"cmp"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/alicebob/miniredis/v2"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redismock/v9"
	"github.com/redis/go-redis/v9"
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

func setupTestRedis(t *testing.T) *redis.Client {
	t.Helper()
	mr, err := miniredis.Run()
	if err != nil {
		t.Skipf("skipping test: miniredis failed: %v", err)
	}
	t.Cleanup(mr.Close)

	return redis.NewClient(&redis.Options{
		Addr: mr.Addr(),
	})
}

func TestHealthController_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	rdb := setupTestRedis(t)

	ctrl := health.NewController(db, rdb)
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
	if res["redis"] != "connected" {
		t.Errorf("expected redis connected, got %s", res["redis"])
	}
}

func TestHealthController_NilDB(t *testing.T) {
	gin.SetMode(gin.TestMode)
	ctrl := health.NewController(nil, nil)

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

	if sqlDB, dbErr := db.DB(); dbErr == nil {
		_ = sqlDB.Close()
	}

	rdb := setupTestRedis(t)
	ctrl := health.NewController(db, rdb)

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
	ctrl := health.NewController(&gorm.DB{Config: &gorm.Config{}}, nil)

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

func TestHealthController_NilRedis(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)
	ctrl := health.NewController(db, nil)

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
	if res["error"] != "redis client is not initialized" {
		t.Errorf("expected error 'redis client is not initialized', got %s", res["error"])
	}
}

func TestHealthController_RedisUnreachable(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)

	rdb, mock := redismock.NewClientMock()
	mock.ExpectPing().SetErr(errors.New("redis connection refused"))

	ctrl := health.NewController(db, rdb)

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
	if res["status"] != "error" {
		t.Errorf("expected status error, got %s", res["status"])
	}
	if res["error"] != "redis unreachable: redis connection refused" {
		t.Errorf("expected redis unreachable error, got %s", res["error"])
	}
}
