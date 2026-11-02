package integration_test

import (
	"cmp"
	"net/http"
	"net/http/httptest"
	"testing"

	"videoStreaming/app"
	"videoStreaming/config"
	"videoStreaming/presentation/controller/health"
	"videoStreaming/route"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestHealthEndpoint_Integration(t *testing.T) {
	dsn := cmp.Or(
		config.GetEnv("DATABASE_URL"),
		config.GetEnv("DB_DSN"),
		config.DefaultConfig().DB.DSN,
	)

	db, err := app.NewGormDB(config.DBConfig{DSN: dsn})
	if err != nil {
		t.Skipf("skipping integration test: database connection failed (%s): %v", dsn, err)
	}

	sqlDB, err := db.DB()
	if err != nil || sqlDB.Ping() != nil {
		t.Skipf("skipping integration test: cannot ping database (%s): %v", dsn, err)
	}

	gin.SetMode(gin.TestMode)
	r := gin.New()
	rdb := redis.NewClient(&redis.Options{
		Addr:     cmp.Or(config.GetEnv("REDIS_ADDR"), "localhost:6379"),
		Password: config.GetEnv("REDIS_PASSWORD"),
	})
	if pingErr := rdb.Ping(t.Context()).Err(); pingErr != nil {
		t.Skipf("skipping integration test: cannot ping redis: %v", pingErr)
	}

	ctrl := health.NewController(db, rdb)
	route.RegisterHealth(r, ctrl)

	req, err := http.NewRequestWithContext(t.Context(), http.MethodGet, "/health", nil)
	require.NoError(t, err)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "ok")
	assert.Contains(t, w.Body.String(), "connected")
}
