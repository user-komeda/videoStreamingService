package stream_test

import (
	"context"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	usecaseStream "videoStreaming/application/usecase/stream"
	"videoStreaming/config"
	domainEntity "videoStreaming/domain/entity/video"
	domainErrors "videoStreaming/domain/errors"
	domainRepo "videoStreaming/domain/repository/video"
	vo "videoStreaming/domain/valueObject/video"
	streamController "videoStreaming/presentation/controller/stream"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
)

type mockRepo struct {
	getByIDFn func(ctx context.Context, id string) (domainEntity.Video, error)
}

func (m *mockRepo) GetAll(_ context.Context) ([]domainEntity.Video, error) {
	return nil, nil
}

func (m *mockRepo) GetByID(ctx context.Context, id string) (domainEntity.Video, error) {
	if m.getByIDFn != nil {
		return m.getByIDFn(ctx, id)
	}
	return domainEntity.Video{}, nil
}

func (m *mockRepo) Create(_ context.Context, v domainEntity.Video) (domainEntity.Video, error) {
	return v, nil
}

func (m *mockRepo) Update(_ context.Context, v domainEntity.Video) (domainEntity.Video, error) {
	return v, nil
}

func (m *mockRepo) Delete(_ context.Context, _ string) error {
	return nil
}

var _ domainRepo.Repository = (*mockRepo)(nil)

func createMockS3Client(t *testing.T, handler http.HandlerFunc) *s3.Client {
	server := httptest.NewServer(handler)
	t.Cleanup(server.Close)

	awsCfg, err := awsconfig.LoadDefaultConfig(
		t.Context(),
		awsconfig.WithRegion("us-east-1"),
		awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider("key", "secret", "")),
	)
	if err != nil {
		t.Fatalf("failed to load config: %v", err)
	}

	return s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(server.URL)
		o.UsePathStyle = true
	})
}

func TestController_Stream(t *testing.T) {
	gin.SetMode(gin.TestMode)
	logger := slog.New(slog.DiscardHandler)
	cfg := config.MinIOConfig{Bucket: "test-bucket"}

	t.Run("empty id", func(t *testing.T) {
		repo := &mockRepo{}
		s3Client := createMockS3Client(t, func(_ http.ResponseWriter, _ *http.Request) {})
		uc := usecaseStream.NewUseCase(repo, s3Client, cfg, logger)
		ctrl := streamController.NewController(uc)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{}
		req, _ := http.NewRequestWithContext(t.Context(), http.MethodGet, "/videos//stream", nil)
		c.Request = req

		ctrl.Stream(c)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected 400 Bad Request, got %d", w.Code)
		}
	})

	t.Run("video not found", func(t *testing.T) {
		repo := &mockRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return domainEntity.Video{}, domainErrors.ErrNotFound
			},
		}
		s3Client := createMockS3Client(t, func(_ http.ResponseWriter, _ *http.Request) {})
		uc := usecaseStream.NewUseCase(repo, s3Client, cfg, logger)
		ctrl := streamController.NewController(uc)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{{Key: "id", Value: "unknown-id"}}
		req, _ := http.NewRequestWithContext(t.Context(), http.MethodGet, "/videos/unknown-id/stream", nil)
		c.Request = req

		ctrl.Stream(c)

		if w.Code != http.StatusNotFound {
			t.Errorf("expected 404 Not Found, got %d", w.Code)
		}
	})

	t.Run("streaming success full", func(t *testing.T) {
		v, _ := domainEntity.Build(domainEntity.Attrs{
			ID:         "v-1",
			Title:      "Test",
			Visibility: vo.Public,
			Status:     vo.StatusReady,
			FilePath:   "video-file.mp4",
		})
		repo := &mockRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return *v, nil
			},
		}
		s3Client := createMockS3Client(t, func(w http.ResponseWriter, _ *http.Request) {
			w.Header().Set("Content-Type", "video/mp4")
			w.Header().Set("Content-Length", "10")
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("0123456789"))
		})
		uc := usecaseStream.NewUseCase(repo, s3Client, cfg, logger)
		ctrl := streamController.NewController(uc)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{{Key: "id", Value: "v-1"}}
		req, _ := http.NewRequestWithContext(t.Context(), http.MethodGet, "/videos/v-1/stream", nil)
		c.Request = req

		ctrl.Stream(c)

		if w.Code != http.StatusOK {
			t.Errorf("expected 200 OK, got %d", w.Code)
		}
		if w.Header().Get("Content-Type") != "video/mp4" {
			t.Errorf("expected Content-Type video/mp4, got %s", w.Header().Get("Content-Type"))
		}
		if w.Body.String() != "0123456789" {
			t.Errorf("expected body 0123456789, got %s", w.Body.String())
		}
	})

	t.Run("streaming success partial range", func(t *testing.T) {
		v, _ := domainEntity.Build(domainEntity.Attrs{
			ID:         "v-1",
			Title:      "Test",
			Visibility: vo.Public,
			Status:     vo.StatusReady,
			FilePath:   "video-file.mp4",
		})
		repo := &mockRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return *v, nil
			},
		}
		s3Client := createMockS3Client(t, func(w http.ResponseWriter, r *http.Request) {
			if r.Header.Get("Range") != "bytes=0-4" {
				t.Errorf("expected Range header bytes=0-4, got %s", r.Header.Get("Range"))
			}
			w.Header().Set("Content-Type", "video/mp4")
			w.Header().Set("Content-Range", "bytes 0-4/10")
			w.Header().Set("Content-Length", "5")
			w.WriteHeader(http.StatusPartialContent)
			_, _ = w.Write([]byte("01234"))
		})
		uc := usecaseStream.NewUseCase(repo, s3Client, cfg, logger)
		ctrl := streamController.NewController(uc)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{{Key: "id", Value: "v-1"}}
		req, _ := http.NewRequestWithContext(t.Context(), http.MethodGet, "/videos/v-1/stream", nil)
		req.Header.Set("Range", "bytes=0-4")
		c.Request = req

		ctrl.Stream(c)

		if w.Code != http.StatusPartialContent {
			t.Errorf("expected 206 Partial Content, got %d", w.Code)
		}
		if w.Header().Get("Content-Range") != "bytes 0-4/10" {
			t.Errorf("expected Content-Range bytes 0-4/10, got %s", w.Header().Get("Content-Range"))
		}
		if w.Body.String() != "01234" {
			t.Errorf("expected body 01234, got %s", w.Body.String())
		}
	})
}
