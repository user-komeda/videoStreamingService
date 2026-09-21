package tus_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"videoStreaming/config"
	libtus "videoStreaming/lib/tus"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestTusHandler_CreationAndOptions(t *testing.T) {
	cfg := config.TusConfig{
		BasePath: "/files/",
	}

	handler, err := libtus.NewHandler(cfg, nil, "test-bucket")
	require.NoError(t, err)
	assert.NotNil(t, handler)

	w := httptest.NewRecorder()
	req, err := http.NewRequestWithContext(t.Context(), http.MethodOptions, "/files/", nil)
	require.NoError(t, err)

	handler.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Header().Get("Tus-Version"), "1.0.0")
	assert.NotEmpty(t, w.Header().Get("Tus-Extension"))
}
