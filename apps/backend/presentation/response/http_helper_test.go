package response_test

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	appErrors "videoStreaming/application/errors"
	"videoStreaming/presentation/response"

	"github.com/gin-gonic/gin"
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestHandleAppError(t *testing.T) {
	tests := []struct {
		name           string
		err            error
		expectedStatus int
		expectedMsg    string
	}{
		{
			name: "InvalidArgument maps to 400",
			err: appErrors.NewAppError(
				appErrors.CodeInvalidArgument,
				"invalid input",
				errors.New("field required"),
			),
			expectedStatus: http.StatusBadRequest,
			expectedMsg:    "invalid input",
		},
		{
			name:           "Unauthorized maps to 401",
			err:            appErrors.NewAppError(appErrors.CodeUnauthorized, "unauthorized", nil),
			expectedStatus: http.StatusUnauthorized,
			expectedMsg:    "unauthorized",
		},
		{
			name:           "Forbidden maps to 403",
			err:            appErrors.NewAppError(appErrors.CodeForbidden, "forbidden", nil),
			expectedStatus: http.StatusForbidden,
			expectedMsg:    "forbidden",
		},
		{
			name:           "NotFound maps to 404",
			err:            appErrors.NewAppError(appErrors.CodeNotFound, "video not found", nil),
			expectedStatus: http.StatusNotFound,
			expectedMsg:    "video not found",
		},
		{
			name: "Conflict maps to 409",
			err: appErrors.NewAppError(
				appErrors.CodeConflict,
				"video already exists",
				nil,
			),
			expectedStatus: http.StatusConflict,
			expectedMsg:    "video already exists",
		},
		{
			name:           "Internal maps to 500",
			err:            appErrors.NewAppError(appErrors.CodeInternal, "database error", nil),
			expectedStatus: http.StatusInternalServerError,
			expectedMsg:    "database error",
		},
		{
			name:           "Generic error maps to 500",
			err:            errors.New("raw error"),
			expectedStatus: http.StatusInternalServerError,
			expectedMsg:    "internal server error",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)

			response.HandleAppError(c, tt.err)

			if w.Code != tt.expectedStatus {
				t.Errorf("expected status %d, got %d", tt.expectedStatus, w.Code)
			}

			var body response.ErrorResponse
			if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
				t.Fatalf("failed to unmarshal response: %v", err)
			}

			if body.Message != tt.expectedMsg {
				t.Errorf("expected message %q, got %q", tt.expectedMsg, body.Message)
			}
		})
	}

	t.Run("unknown error code maps to 500", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		appErr := appErrors.NewAppError(appErrors.ErrorCode("UNKNOWN_CODE"), "unknown issue", nil)
		response.HandleAppError(c, appErr)

		if w.Code != http.StatusInternalServerError {
			t.Errorf("expected 500, got %d", w.Code)
		}
	})
}

func TestResponseHelpers(t *testing.T) {
	t.Run("OK", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		response.OK(c, gin.H{"key": "value"})
		if w.Code != http.StatusOK {
			t.Errorf("expected 200, got %d", w.Code)
		}
	})

	t.Run("Created", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		response.Created(c, gin.H{"key": "value"})
		if w.Code != http.StatusCreated {
			t.Errorf("expected 201, got %d", w.Code)
		}
	})

	t.Run("NoContent", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		response.NoContent(c)
		c.Writer.WriteHeaderNow()
		if w.Code != http.StatusNoContent {
			t.Errorf("expected 204, got %d", w.Code)
		}
	})

	t.Run("BadRequest", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		response.BadRequest(c, "bad request", "detail1")
		if w.Code != http.StatusBadRequest {
			t.Errorf("expected 400, got %d", w.Code)
		}
	})

	t.Run("Unauthorized", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		response.Unauthorized(c, "unauthorized")
		if w.Code != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", w.Code)
		}
	})

	t.Run("Forbidden", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		response.Forbidden(c, "forbidden")
		if w.Code != http.StatusForbidden {
			t.Errorf("expected 403, got %d", w.Code)
		}
	})

	t.Run("NotFound", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		response.NotFound(c, "not found")
		if w.Code != http.StatusNotFound {
			t.Errorf("expected 404, got %d", w.Code)
		}
	})

	t.Run("Conflict", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		response.Conflict(c, "conflict")
		if w.Code != http.StatusConflict {
			t.Errorf("expected 409, got %d", w.Code)
		}
	})

	t.Run("InternalServerError", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		response.InternalServerError(c, "internal error")
		if w.Code != http.StatusInternalServerError {
			t.Errorf("expected 500, got %d", w.Code)
		}
	})
}

func TestPaginationHelpers(t *testing.T) {
	param := response.NewPaginationParam(100, 1, 10)
	if param.Total != 100 || param.Page != 1 || param.PerPage != 10 {
		t.Errorf("unexpected param: %+v", param)
	}

	meta := response.NewPaginationMeta(param)
	if meta.Total != 100 || meta.Page != 1 || meta.PerPage != 10 || meta.TotalPages != 10 ||
		!meta.HasNext {
		t.Errorf("unexpected meta: %+v", meta)
	}

	zeroParam := response.NewPaginationParam(0, 1, 0)
	zeroMeta := response.NewPaginationMeta(zeroParam)
	if zeroMeta.TotalPages != 0 || zeroMeta.HasNext {
		t.Errorf("unexpected zero meta: %+v", zeroMeta)
	}
}
