package health_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"

	"videoStreaming/presentation/controller/health"
)

func TestHealthController(t *testing.T) {
	gin.SetMode(gin.TestMode)
	ctrl := health.NewController()
	if ctrl == nil {
		t.Fatal("expected non-nil controller")
	}

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

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
}
