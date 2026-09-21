package tus_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"videoStreaming/config"
	libtus "videoStreaming/lib/tus"
	controllerTus "videoStreaming/presentation/controller/tus"

	"github.com/gin-gonic/gin"
)

func TestTusController(t *testing.T) {
	gin.SetMode(gin.TestMode)

	handler, err := libtus.NewHandler(config.TusConfig{
		BasePath: "/files/",
	}, nil, "test-bucket")
	if err != nil {
		t.Fatalf("failed to create tus handler: %v", err)
	}

	// Test without leading slash in BasePath
	ctrl := controllerTus.NewController(config.TusConfig{BasePath: "files/"}, handler)
	router := gin.New()
	router.Any("/files/*any", ctrl.Handle())

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodOptions, "/files/", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 for OPTIONS, got %d", w.Code)
	}
}
