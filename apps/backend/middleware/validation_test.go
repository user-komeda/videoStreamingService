package middleware_test

import (
	"bytes"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"videoStreaming/middleware"

	"github.com/gin-gonic/gin"
)

type sampleReq struct {
	Name string `json:"name"`
}

func TestValidateJSON(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := gin.New()
	r.POST("/test", middleware.ValidateJSON(func(req sampleReq) error {
		if req.Name == "invalid" {
			return errors.New("name is invalid")
		}
		return nil
	}), func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Invalid JSON
	w1 := httptest.NewRecorder()
	req1, _ := http.NewRequest(http.MethodPost, "/test", bytes.NewBufferString("{invalid json"))
	r.ServeHTTP(w1, req1)
	if w1.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for bad json, got %d", w1.Code)
	}

	// Validation fails
	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest(
		http.MethodPost,
		"/test",
		bytes.NewBufferString(`{"name":"invalid"}`),
	)
	r.ServeHTTP(w2, req2)
	if w2.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for validation error, got %d", w2.Code)
	}

	// Success
	w3 := httptest.NewRecorder()
	req3, _ := http.NewRequest(http.MethodPost, "/test", bytes.NewBufferString(`{"name":"valid"}`))
	r.ServeHTTP(w3, req3)
	if w3.Code != http.StatusOK {
		t.Fatalf("expected 200 for valid req, got %d", w3.Code)
	}
}
