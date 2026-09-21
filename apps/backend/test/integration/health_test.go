package integration_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"videoStreaming/presentation/controller/health"
	"videoStreaming/route"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestHealthEndpoint_Integration(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	ctrl := health.NewController()
	route.RegisterHealth(r, ctrl)

	req, err := http.NewRequestWithContext(t.Context(), http.MethodGet, "/health", nil)
	require.NoError(t, err)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "ok")
}
