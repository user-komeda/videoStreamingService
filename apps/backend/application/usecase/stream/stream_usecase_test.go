package stream_test

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	appErrors "videoStreaming/application/errors"
	usecaseStream "videoStreaming/application/usecase/stream"
	"videoStreaming/config"
	domainEntity "videoStreaming/domain/entity/video"
	domainErrors "videoStreaming/domain/errors"
	domainRepo "videoStreaming/domain/repository/video"
	vo "videoStreaming/domain/valueObject/video"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gabriel-vasile/mimetype"
)

type mockVideoRepo struct {
	getByIDFn func(ctx context.Context, id string) (domainEntity.Video, error)
}

func (m *mockVideoRepo) GetAll(_ context.Context) ([]domainEntity.Video, error) {
	return nil, nil
}

func (m *mockVideoRepo) GetByID(ctx context.Context, id string) (domainEntity.Video, error) {
	if m.getByIDFn != nil {
		return m.getByIDFn(ctx, id)
	}
	return domainEntity.Video{}, nil
}

func (m *mockVideoRepo) Create(_ context.Context, v domainEntity.Video) (domainEntity.Video, error) {
	return v, nil
}

func (m *mockVideoRepo) Update(_ context.Context, v domainEntity.Video) (domainEntity.Video, error) {
	return v, nil
}

func (m *mockVideoRepo) Delete(_ context.Context, _ string) error {
	return nil
}

var _ domainRepo.Repository = (*mockVideoRepo)(nil)

func createMockS3Client(t *testing.T, handler http.HandlerFunc) *s3.Client {
	server := httptest.NewServer(handler)
	t.Cleanup(server.Close)

	awsCfg, err := awsconfig.LoadDefaultConfig(
		t.Context(),
		awsconfig.WithRegion("us-east-1"),
		awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider("key", "secret", "")),
	)
	if err != nil {
		t.Fatalf("failed to load default config: %v", err)
	}

	return s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(server.URL)
		o.UsePathStyle = true
	})
}

func TestStreamUseCase_ValidationErrors(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	cfg := config.MinIOConfig{Bucket: "test-bucket"}

	t.Run("empty video ID returns error", func(t *testing.T) {
		repo := &mockVideoRepo{}
		s3Client := createMockS3Client(t, func(_ http.ResponseWriter, _ *http.Request) {})
		uc := usecaseStream.NewUseCase(repo, s3Client, cfg, logger)

		_, err := uc.Invoke(t.Context(), "", "")
		if err == nil {
			t.Fatalf("expected error for empty video ID")
		}
	})

	t.Run("video not found returns error", func(t *testing.T) {
		repo := &mockVideoRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return domainEntity.Video{}, domainErrors.ErrNotFound
			},
		}
		s3Client := createMockS3Client(t, func(_ http.ResponseWriter, _ *http.Request) {})
		uc := usecaseStream.NewUseCase(repo, s3Client, cfg, logger)

		_, err := uc.Invoke(t.Context(), "non-existent", "")
		if err == nil {
			t.Fatalf("expected error for non-existent video")
		}
	})

	t.Run("video file path empty returns error", func(t *testing.T) {
		v, _ := domainEntity.Build(domainEntity.Attrs{
			ID:         "v-1",
			Title:      "Test",
			Visibility: vo.Public,
			Status:     vo.StatusNotReady,
			FilePath:   "",
		})
		repo := &mockVideoRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return *v, nil
			},
		}
		s3Client := createMockS3Client(t, func(_ http.ResponseWriter, _ *http.Request) {})
		uc := usecaseStream.NewUseCase(repo, s3Client, cfg, logger)

		_, err := uc.Invoke(t.Context(), "v-1", "")
		if err == nil {
			t.Fatalf("expected error for empty file path")
		}
	})
}

func TestStreamUseCase_Success(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	cfg := config.MinIOConfig{Bucket: "test-bucket"}

	t.Run("streaming full content", func(t *testing.T) {
		v, _ := domainEntity.Build(domainEntity.Attrs{
			ID:         "v-1",
			Title:      "Test",
			Visibility: vo.Public,
			Status:     vo.StatusReady,
			FilePath:   "video-file.mp4",
		})
		repo := &mockVideoRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return *v, nil
			},
		}

		s3Client := createMockS3Client(t, func(w http.ResponseWriter, _ *http.Request) {
			w.Header().Set("Content-Type", "video/mp4")
			w.Header().Set("Content-Length", "12")
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("video-stream"))
		})

		uc := usecaseStream.NewUseCase(repo, s3Client, cfg, logger)
		out, err := uc.Invoke(t.Context(), "v-1", "")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		defer out.Body.Close()

		data, _ := io.ReadAll(out.Body)
		if string(data) != "video-stream" {
			t.Fatalf("unexpected stream body: %s", string(data))
		}
		if out.StatusCode != http.StatusOK {
			t.Fatalf("expected status 200, got %d", out.StatusCode)
		}
	})

	t.Run("streaming partial content (Range)", func(t *testing.T) {
		v, _ := domainEntity.Build(domainEntity.Attrs{
			ID:         "v-1",
			Title:      "Test",
			Visibility: vo.Public,
			Status:     vo.StatusReady,
			FilePath:   "video-file.mp4",
		})
		repo := &mockVideoRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return *v, nil
			},
		}

		s3Client := createMockS3Client(t, func(w http.ResponseWriter, r *http.Request) {
			if r.Header.Get("Range") != "bytes=0-5" {
				t.Errorf("expected Range header bytes=0-5, got %s", r.Header.Get("Range"))
			}
			w.Header().Set("Content-Type", "video/mp4")
			w.Header().Set("Content-Range", "bytes 0-5/12")
			w.Header().Set("Content-Length", "6")
			w.WriteHeader(http.StatusPartialContent)
			_, _ = w.Write([]byte("video-"))
		})

		uc := usecaseStream.NewUseCase(repo, s3Client, cfg, logger)
		out, err := uc.Invoke(t.Context(), "v-1", "bytes=0-5")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		defer out.Body.Close()

		if out.StatusCode != http.StatusPartialContent {
			t.Fatalf("expected status 206, got %d", out.StatusCode)
		}
		if out.ContentRange != "bytes 0-5/12" {
			t.Fatalf("expected Content-Range bytes 0-5/12, got %s", out.ContentRange)
		}
	})
}

func TestStreamUseCase_StorageError(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	cfg := config.MinIOConfig{Bucket: "test-bucket"}

	v, _ := domainEntity.Build(domainEntity.Attrs{
		ID:         "v-1",
		Title:      "Test",
		Visibility: vo.Public,
		Status:     vo.StatusReady,
		FilePath:   "video-file.mp4",
	})
	repo := &mockVideoRepo{
		getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
			return *v, nil
		},
	}

	t.Run("s3 not found error", func(t *testing.T) {
		s3Client := createMockS3Client(t, func(w http.ResponseWriter, _ *http.Request) {
			w.WriteHeader(http.StatusNotFound)
			_, _ = w.Write([]byte(
				`<Error><Code>NoSuchKey</Code><Message>The specified key does not exist.</Message></Error>`,
			))
		})

		uc := usecaseStream.NewUseCase(repo, s3Client, cfg, logger)
		_, err := uc.Invoke(t.Context(), "v-1", "")
		if err == nil {
			t.Fatalf("expected error from S3")
		}
		appErr := appErrors.FromDomainError(err, "")
		if appErr == nil {
			t.Fatalf("expected non-nil app error")
		}
	})

	t.Run("s3 generic internal error", func(t *testing.T) {
		s3Client := createMockS3Client(t, func(w http.ResponseWriter, _ *http.Request) {
			w.WriteHeader(http.StatusInternalServerError)
		})

		uc := usecaseStream.NewUseCase(repo, s3Client, cfg, logger)
		_, err := uc.Invoke(t.Context(), "v-1", "")
		if err == nil {
			t.Fatalf("expected error from S3")
		}
	})

	t.Run("s3 returns octet-stream and falls back to entity mimetype", func(t *testing.T) {
		mime := mimetype.Lookup("video/mp4")
		videoWithMime, _ := domainEntity.Build(domainEntity.Attrs{
			ID:         "v-1",
			Title:      "Test",
			Visibility: vo.Public,
			Status:     vo.StatusReady,
			FilePath:   "video-file.mp4",
			MimeType:   mime,
		})
		repoWithMime := &mockVideoRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return *videoWithMime, nil
			},
		}

		s3Client := createMockS3Client(t, func(w http.ResponseWriter, _ *http.Request) {
			w.Header().Set("Content-Type", "application/octet-stream")
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("data"))
		})

		uc := usecaseStream.NewUseCase(repoWithMime, s3Client, cfg, logger)
		out, err := uc.Invoke(t.Context(), "v-1", "bytes=0-1")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		defer out.Body.Close()
		if out.ContentType != "video/mp4" {
			t.Fatalf("expected video/mp4, got %s", out.ContentType)
		}
		if out.StatusCode != http.StatusPartialContent {
			t.Fatalf("expected 206 for range request without content-range header, got %d", out.StatusCode)
		}
	})
}
