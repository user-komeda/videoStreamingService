package video_test

import (
	"context"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	usecaseVideo "videoStreaming/application/usecase/video"
	domainEntity "videoStreaming/domain/entity/video"
	domainErrors "videoStreaming/domain/errors"
	domainRepo "videoStreaming/domain/repository/video"
	videoController "videoStreaming/presentation/controller/video"

	"github.com/gin-gonic/gin"
)

type mockRepo struct {
	getAllFn  func(ctx context.Context) ([]domainEntity.Video, error)
	getByIDFn func(ctx context.Context, id string) (domainEntity.Video, error)
	createFn  func(ctx context.Context, v domainEntity.Video) (domainEntity.Video, error)
	updateFn  func(ctx context.Context, v domainEntity.Video) (domainEntity.Video, error)
	deleteFn  func(ctx context.Context, id string) error
}

func (m *mockRepo) GetAll(ctx context.Context) ([]domainEntity.Video, error) {
	if m.getAllFn != nil {
		return m.getAllFn(ctx)
	}
	return nil, nil
}

func (m *mockRepo) GetByID(ctx context.Context, id string) (domainEntity.Video, error) {
	if m.getByIDFn != nil {
		return m.getByIDFn(ctx, id)
	}
	return domainEntity.Video{}, nil
}

func (m *mockRepo) Create(ctx context.Context, v domainEntity.Video) (domainEntity.Video, error) {
	if m.createFn != nil {
		return m.createFn(ctx, v)
	}
	return v, nil
}

func (m *mockRepo) Update(ctx context.Context, v domainEntity.Video) (domainEntity.Video, error) {
	if m.updateFn != nil {
		return m.updateFn(ctx, v)
	}
	return v, nil
}

func (m *mockRepo) Delete(ctx context.Context, id string) error {
	if m.deleteFn != nil {
		return m.deleteFn(ctx, id)
	}
	return nil
}

var _ domainRepo.Repository = (*mockRepo)(nil)

func newController(repo domainRepo.Repository) *videoController.Controller {
	gin.SetMode(gin.TestMode)
	logger := slog.New(slog.DiscardHandler)
	return videoController.NewController(
		usecaseVideo.NewGetAllUseCase(repo, logger),
		usecaseVideo.NewGetDetailUseCase(repo, logger),
		usecaseVideo.NewCreateUseCase(repo, logger),
		usecaseVideo.NewUpdateUseCase(repo, logger),
		usecaseVideo.NewDeleteUseCase(repo, logger),
	)
}

func TestController_Show_NotFound(t *testing.T) {
	repo := &mockRepo{
		getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
			return domainEntity.Video{}, domainErrors.ErrNotFound
		},
	}
	ctrl := newController(repo)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "non-existing-id"}}
	req, _ := http.NewRequestWithContext(
		t.Context(),
		http.MethodGet,
		"/videos/non-existing-id",
		nil,
	)
	c.Request = req

	ctrl.Show(c)

	if w.Code != http.StatusNotFound {
		t.Errorf("expected 404 Not Found, got %d", w.Code)
	}
}

func TestController_Show_EmptyID(t *testing.T) {
	ctrl := newController(&mockRepo{})

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{}
	req, _ := http.NewRequestWithContext(t.Context(), http.MethodGet, "/videos/", nil)
	c.Request = req

	ctrl.Show(c)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400 Bad Request, got %d", w.Code)
	}
}

func TestController_Show_Success(t *testing.T) {
	v, _ := domainEntity.Build(domainEntity.Attrs{
		ID:         "v-1",
		Title:      "Title 1",
		Visibility: "public",
		Status:     "ready",
	})
	repo := &mockRepo{
		getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
			return *v, nil
		},
	}
	ctrl := newController(repo)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "v-1"}}
	req, _ := http.NewRequestWithContext(t.Context(), http.MethodGet, "/videos/v-1", nil)
	c.Request = req

	ctrl.Show(c)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200 OK, got %d", w.Code)
	}
}

func TestController_Index(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		repo := &mockRepo{
			getAllFn: func(_ context.Context) ([]domainEntity.Video, error) {
				return []domainEntity.Video{}, nil
			},
		}
		ctrl := newController(repo)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		req, _ := http.NewRequestWithContext(t.Context(), http.MethodGet, "/videos", nil)
		c.Request = req

		ctrl.Index(c)

		if w.Code != http.StatusOK {
			t.Errorf("expected 200 OK, got %d", w.Code)
		}
	})

	t.Run("error", func(t *testing.T) {
		repo := &mockRepo{
			getAllFn: func(_ context.Context) ([]domainEntity.Video, error) {
				return nil, domainErrors.ErrInternal
			},
		}
		ctrl := newController(repo)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		req, _ := http.NewRequestWithContext(t.Context(), http.MethodGet, "/videos", nil)
		c.Request = req

		ctrl.Index(c)

		if w.Code != http.StatusInternalServerError {
			t.Errorf("expected 500 Internal, got %d", w.Code)
		}
	})
}

func TestController_Show_InternalServerError(t *testing.T) {
	repo := &mockRepo{
		getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
			return domainEntity.Video{}, domainErrors.ErrInternal
		},
	}
	ctrl := newController(repo)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "some-id"}}
	req, _ := http.NewRequestWithContext(t.Context(), http.MethodGet, "/videos/some-id", nil)
	c.Request = req

	ctrl.Show(c)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("expected 500 Internal Server Error, got %d", w.Code)
	}
}

func TestController_Create(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		v, _ := domainEntity.Build(domainEntity.Attrs{
			ID:         "v-1",
			Title:      "Sample",
			Visibility: "public",
			Status:     "ready",
		})
		repo := &mockRepo{
			createFn: func(_ context.Context, _ domainEntity.Video) (domainEntity.Video, error) {
				return *v, nil
			},
		}
		ctrl := newController(repo)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		body := `{"title":"Sample","description":"Sample Desc","visibility":"public"}`
		req, _ := http.NewRequestWithContext(
			t.Context(),
			http.MethodPost,
			"/videos",
			strings.NewReader(body),
		)
		req.Header.Set("Content-Type", "application/json")
		c.Request = req

		ctrl.Create(c)

		if w.Code != http.StatusCreated {
			t.Errorf("expected 201 Created, got %d", w.Code)
		}
	})

	t.Run("invalid json", func(t *testing.T) {
		ctrl := newController(&mockRepo{})

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		req, _ := http.NewRequestWithContext(
			t.Context(),
			http.MethodPost,
			"/videos",
			strings.NewReader("invalid"),
		)
		req.Header.Set("Content-Type", "application/json")
		c.Request = req

		ctrl.Create(c)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected 400 Bad Request, got %d", w.Code)
		}
	})

	t.Run("invalid request data to dto", func(t *testing.T) {
		ctrl := newController(&mockRepo{})

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		body := `{"title":"Sample","visibility":"invalid_vis"}`
		req, _ := http.NewRequestWithContext(
			t.Context(),
			http.MethodPost,
			"/videos",
			strings.NewReader(body),
		)
		req.Header.Set("Content-Type", "application/json")
		c.Request = req

		ctrl.Create(c)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected 400 Bad Request, got %d", w.Code)
		}
	})

	t.Run("conflict", func(t *testing.T) {
		repo := &mockRepo{
			createFn: func(_ context.Context, _ domainEntity.Video) (domainEntity.Video, error) {
				return domainEntity.Video{}, domainErrors.ErrAlreadyExists
			},
		}
		ctrl := newController(repo)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		body := `{"title":"Sample","description":"Sample Desc","visibility":"public"}`
		req, _ := http.NewRequestWithContext(
			t.Context(),
			http.MethodPost,
			"/videos",
			strings.NewReader(body),
		)
		req.Header.Set("Content-Type", "application/json")
		c.Request = req

		ctrl.Create(c)

		if w.Code != http.StatusConflict {
			t.Errorf("expected 409 Conflict, got %d", w.Code)
		}
	})
}

func TestController_Update(t *testing.T) {
	t.Run("empty id", func(t *testing.T) {
		ctrl := newController(&mockRepo{})

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{}
		req, _ := http.NewRequestWithContext(t.Context(), http.MethodPut, "/videos/", nil)
		c.Request = req

		ctrl.Update(c)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected 400 Bad Request, got %d", w.Code)
		}
	})

	t.Run("invalid json", func(t *testing.T) {
		ctrl := newController(&mockRepo{})

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{{Key: "id", Value: "v-1"}}
		req, _ := http.NewRequestWithContext(
			t.Context(),
			http.MethodPut,
			"/videos/v-1",
			strings.NewReader("bad"),
		)
		c.Request = req

		ctrl.Update(c)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected 400 Bad Request, got %d", w.Code)
		}
	})

	t.Run("invalid data", func(t *testing.T) {
		ctrl := newController(&mockRepo{})

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{{Key: "id", Value: "v-1"}}
		req, _ := http.NewRequestWithContext(
			t.Context(),
			http.MethodPut,
			"/videos/v-1",
			strings.NewReader(`{"visibility":"invalid"}`),
		)
		c.Request = req

		ctrl.Update(c)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected 400 Bad Request, got %d", w.Code)
		}
	})

	t.Run("success", func(t *testing.T) {
		v, _ := domainEntity.Build(domainEntity.Attrs{
			ID:         "v-1",
			Title:      "Original",
			Visibility: "public",
			Status:     "ready",
		})
		repo := &mockRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return *v, nil
			},
			updateFn: func(_ context.Context, v domainEntity.Video) (domainEntity.Video, error) {
				return v, nil
			},
		}
		ctrl := newController(repo)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{{Key: "id", Value: "v-1"}}
		req, _ := http.NewRequestWithContext(
			t.Context(),
			http.MethodPut,
			"/videos/v-1",
			strings.NewReader(`{"title":"New Title"}`),
		)
		c.Request = req

		ctrl.Update(c)
		c.Writer.WriteHeaderNow()

		if w.Code != http.StatusNoContent {
			t.Errorf("expected 204 NoContent, got %d", w.Code)
		}
	})

	t.Run("not found", func(t *testing.T) {
		repo := &mockRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return domainEntity.Video{}, domainErrors.ErrNotFound
			},
		}
		ctrl := newController(repo)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{{Key: "id", Value: "missing-id"}}
		body := `{"title":"Updated Title"}`
		req, _ := http.NewRequestWithContext(
			t.Context(),
			http.MethodPut,
			"/videos/missing-id",
			strings.NewReader(body),
		)
		req.Header.Set("Content-Type", "application/json")
		c.Request = req

		ctrl.Update(c)

		if w.Code != http.StatusNotFound {
			t.Errorf("expected 404 Not Found, got %d", w.Code)
		}
	})
}

func TestController_Delete(t *testing.T) {
	t.Run("empty id", func(t *testing.T) {
		ctrl := newController(&mockRepo{})

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{}
		req, _ := http.NewRequestWithContext(t.Context(), http.MethodDelete, "/videos/", nil)
		c.Request = req

		ctrl.Delete(c)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected 400 Bad Request, got %d", w.Code)
		}
	})

	t.Run("success", func(t *testing.T) {
		repo := &mockRepo{
			deleteFn: func(_ context.Context, _ string) error {
				return nil
			},
		}
		ctrl := newController(repo)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{{Key: "id", Value: "v-1"}}
		req, _ := http.NewRequestWithContext(t.Context(), http.MethodDelete, "/videos/v-1", nil)
		c.Request = req

		ctrl.Delete(c)
		c.Writer.WriteHeaderNow()

		if w.Code != http.StatusNoContent {
			t.Errorf("expected 204 NoContent, got %d", w.Code)
		}
	})

	t.Run("error", func(t *testing.T) {
		repo := &mockRepo{
			deleteFn: func(_ context.Context, _ string) error {
				return domainErrors.ErrNotFound
			},
		}
		ctrl := newController(repo)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{{Key: "id", Value: "v-1"}}
		req, _ := http.NewRequestWithContext(t.Context(), http.MethodDelete, "/videos/v-1", nil)
		c.Request = req

		ctrl.Delete(c)

		if w.Code != http.StatusNotFound {
			t.Errorf("expected 404 Not Found, got %d", w.Code)
		}
	})
}
