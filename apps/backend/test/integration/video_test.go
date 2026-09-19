package integration_test

import (
	"bytes"
	"cmp"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"videoStreaming/app"
	usecaseVideo "videoStreaming/application/usecase/video"
	"videoStreaming/config"
	infraEntity "videoStreaming/infrastructure/entity/video"
	infraRepo "videoStreaming/infrastructure/repository/video"
	videoController "videoStreaming/presentation/controller/video"
	videoReq "videoStreaming/presentation/request/video"
	videoRes "videoStreaming/presentation/response/video"
	"videoStreaming/route"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupTestContext(t *testing.T) *gin.Engine {
	t.Helper()

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

	if migrateErr := db.AutoMigrate(&infraEntity.Entity{}); migrateErr != nil {
		t.Fatalf("failed to auto migrate video entity: %v", migrateErr)
	}

	// Clean up table
	_ = db.Exec("DELETE FROM videos").Error
	t.Cleanup(func() {
		_ = db.Exec("DELETE FROM videos").Error
	})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	logger := slog.New(slog.DiscardHandler)
	repo := infraRepo.NewRepository(db, logger)

	ctrl := videoController.NewController(
		usecaseVideo.NewGetAllUseCase(repo, logger),
		usecaseVideo.NewGetDetailUseCase(repo, logger),
		usecaseVideo.NewCreateUseCase(repo, logger),
		usecaseVideo.NewUpdateUseCase(repo, logger),
		usecaseVideo.NewDeleteUseCase(repo, logger),
	)

	route.RegisterVideo(r, ctrl)
	return r
}

func performRequest(
	t *testing.T,
	router *gin.Engine,
	method, path string,
	body any,
) *httptest.ResponseRecorder {
	t.Helper()

	var reqBody io.Reader
	if body != nil {
		switch v := body.(type) {
		case string:
			reqBody = strings.NewReader(v)
		case []byte:
			reqBody = bytes.NewReader(v)
		case io.Reader:
			reqBody = v
		default:
			b, err := json.Marshal(body)
			require.NoError(t, err)
			reqBody = bytes.NewReader(b)
		}
	}

	req, err := http.NewRequestWithContext(t.Context(), method, path, reqBody)
	require.NoError(t, err)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func createTestVideo(t *testing.T, router *gin.Engine, title, description string) string {
	t.Helper()

	payload := videoReq.CreateVideoRequest{
		Title:       title,
		Description: description,
		Visibility:  "public",
	}

	w := performRequest(t, router, http.MethodPost, "/videos", payload)
	require.Equal(t, http.StatusCreated, w.Code)

	var res videoRes.Response
	err := json.Unmarshal(w.Body.Bytes(), &res)
	require.NoError(t, err)
	require.NotEmpty(t, res.ID)

	return res.ID
}

func TestVideo_Create(t *testing.T) {
	router := setupTestContext(t)

	t.Run("Success", func(t *testing.T) {
		payload := videoReq.CreateVideoRequest{
			Title:       "Test Create Route",
			Description: "Testing video creation",
			Visibility:  "public",
		}

		w := performRequest(t, router, http.MethodPost, "/videos", payload)
		assert.Equal(t, http.StatusCreated, w.Code)

		var res videoRes.Response
		err := json.Unmarshal(w.Body.Bytes(), &res)
		require.NoError(t, err)
		assert.NotEmpty(t, res.ID)
		assert.Equal(t, "Test Create Route", res.Title)
		assert.Equal(t, "Testing video creation", res.Description)
	})

	t.Run("BadRequest_InvalidJSON", func(t *testing.T) {
		w := performRequest(t, router, http.MethodPost, "/videos", "invalid-json")
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("BadRequest_MissingRequiredFields", func(t *testing.T) {
		payload := map[string]string{
			"description": "missing title and visibility",
		}
		w := performRequest(t, router, http.MethodPost, "/videos", payload)
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestVideo_GetByID(t *testing.T) {
	router := setupTestContext(t)

	t.Run("Success", func(t *testing.T) {
		videoID := createTestVideo(t, router, "Show Route", "Show Description")

		w := performRequest(t, router, http.MethodGet, "/videos/"+videoID, nil)
		assert.Equal(t, http.StatusOK, w.Code)

		var res videoRes.Response
		err := json.Unmarshal(w.Body.Bytes(), &res)
		require.NoError(t, err)
		assert.Equal(t, videoID, res.ID)
		assert.Equal(t, "Show Route", res.Title)
	})

	t.Run("NotFound", func(t *testing.T) {
		w := performRequest(
			t,
			router,
			http.MethodGet,
			"/videos/00000000-0000-0000-0000-000000000000",
			nil,
		)
		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestVideo_GetAll(t *testing.T) {
	router := setupTestContext(t)

	_ = createTestVideo(t, router, "Route 1", "Desc 1")
	_ = createTestVideo(t, router, "Route 2", "Desc 2")

	w := performRequest(t, router, http.MethodGet, "/videos", nil)
	assert.Equal(t, http.StatusOK, w.Code)

	var res []videoRes.Response
	err := json.Unmarshal(w.Body.Bytes(), &res)
	require.NoError(t, err)
	assert.Len(t, res, 2)
}

func TestVideo_Update(t *testing.T) {
	router := setupTestContext(t)

	t.Run("Success", func(t *testing.T) {
		videoID := createTestVideo(t, router, "Initial Title", "Initial Desc")

		updatePayload := videoReq.UpdateVideoRequest{
			Title: "Updated Title",
		}
		w := performRequest(t, router, http.MethodPut, "/videos/"+videoID, updatePayload)
		assert.Equal(t, http.StatusNoContent, w.Code)

		// Verify update
		getW := performRequest(t, router, http.MethodGet, "/videos/"+videoID, nil)
		assert.Equal(t, http.StatusOK, getW.Code)

		var res videoRes.Response
		err := json.Unmarshal(getW.Body.Bytes(), &res)
		require.NoError(t, err)
		assert.Equal(t, "Updated Title", res.Title)
	})

	t.Run("NotFound", func(t *testing.T) {
		updatePayload := videoReq.UpdateVideoRequest{
			Title: "Updated Title",
		}
		w := performRequest(
			t,
			router,
			http.MethodPut,
			"/videos/00000000-0000-0000-0000-000000000000",
			updatePayload,
		)
		assert.Equal(t, http.StatusNotFound, w.Code)
	})

	t.Run("BadRequest_InvalidJSON", func(t *testing.T) {
		videoID := createTestVideo(t, router, "Test Route", "Test Desc")
		w := performRequest(t, router, http.MethodPut, "/videos/"+videoID, "invalid-json")
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestVideo_Delete(t *testing.T) {
	router := setupTestContext(t)

	t.Run("Success", func(t *testing.T) {
		videoID := createTestVideo(t, router, "Route to Delete", "Delete Desc")

		w := performRequest(t, router, http.MethodDelete, "/videos/"+videoID, nil)
		assert.Equal(t, http.StatusNoContent, w.Code)

		// Verify deletion
		getW := performRequest(t, router, http.MethodGet, "/videos/"+videoID, nil)
		assert.Equal(t, http.StatusNotFound, getW.Code)
	})
}
