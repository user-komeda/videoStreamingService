package upload_test

import (
	"bytes"
	"context"
	"encoding/binary"
	"errors"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"

	"videoStreaming/application/usecase/upload"
	"videoStreaming/config"
	domainUpload "videoStreaming/domain/entity/upload"
	domainVideo "videoStreaming/domain/entity/video"
	uploadEvent "videoStreaming/domain/event/upload"
	vo "videoStreaming/domain/valueObject/video"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func buildMinimalMP4WithDuration(duration uint32, timescale uint32) []byte {
	mvhdPayload := new(bytes.Buffer)
	mvhdPayload.WriteByte(0)
	mvhdPayload.Write([]byte{0, 0, 0})
	_ = binary.Write(mvhdPayload, binary.BigEndian, uint32(0))
	_ = binary.Write(mvhdPayload, binary.BigEndian, uint32(0))
	_ = binary.Write(mvhdPayload, binary.BigEndian, timescale)
	_ = binary.Write(mvhdPayload, binary.BigEndian, duration)
	_ = binary.Write(mvhdPayload, binary.BigEndian, uint32(0x00010000))
	_ = binary.Write(mvhdPayload, binary.BigEndian, uint16(0x0100))
	mvhdPayload.Write(make([]byte, 10))
	mvhdPayload.Write(make([]byte, 36))
	mvhdPayload.Write(make([]byte, 24))
	_ = binary.Write(mvhdPayload, binary.BigEndian, uint32(2))

	mvhdBox := new(bytes.Buffer)
	_ = binary.Write(mvhdBox, binary.BigEndian, uint32(8+mvhdPayload.Len()))
	mvhdBox.WriteString("mvhd")
	mvhdBox.Write(mvhdPayload.Bytes())

	moovBox := new(bytes.Buffer)
	_ = binary.Write(moovBox, binary.BigEndian, uint32(8+mvhdBox.Len()))
	moovBox.WriteString("moov")
	moovBox.Write(mvhdBox.Bytes())

	ftypBox := new(bytes.Buffer)
	ftypPayload := []byte("isom\x00\x00\x02\x00isomiso2mp41")
	_ = binary.Write(ftypBox, binary.BigEndian, uint32(8+len(ftypPayload)))
	ftypBox.WriteString("ftyp")
	ftypBox.Write(ftypPayload)

	result := new(bytes.Buffer)
	result.Write(ftypBox.Bytes())
	result.Write(moovBox.Bytes())
	return result.Bytes()
}

type mockUploadRepo struct {
	upsertFunc func(ctx context.Context, u domainUpload.Upload) error
}

func (m *mockUploadRepo) Upsert(ctx context.Context, u domainUpload.Upload) error {
	if m.upsertFunc != nil {
		return m.upsertFunc(ctx, u)
	}
	return nil
}

type mockVideoRepo struct {
	getByIDFunc func(ctx context.Context, id string) (domainVideo.Video, error)
	updateFunc  func(ctx context.Context, v domainVideo.Video) (domainVideo.Video, error)
}

func (m *mockVideoRepo) GetAll(_ context.Context) ([]domainVideo.Video, error) {
	return nil, nil
}

func (m *mockVideoRepo) GetByID(ctx context.Context, id string) (domainVideo.Video, error) {
	if m.getByIDFunc != nil {
		return m.getByIDFunc(ctx, id)
	}
	return domainVideo.Video{}, nil
}

func (m *mockVideoRepo) Create(_ context.Context, v domainVideo.Video) (domainVideo.Video, error) {
	return v, nil
}

func (m *mockVideoRepo) Update(ctx context.Context, v domainVideo.Video) (domainVideo.Video, error) {
	if m.updateFunc != nil {
		return m.updateFunc(ctx, v)
	}
	return v, nil
}

func (m *mockVideoRepo) Delete(_ context.Context, _ string) error {
	return nil
}

func TestUploadUsecase_ValidationAndUpsert(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	cfg := config.MinIOConfig{Bucket: "test-bucket"}

	t.Run("empty ID does nothing", func(t *testing.T) {
		called := false
		uploadRepo := &mockUploadRepo{
			upsertFunc: func(_ context.Context, _ domainUpload.Upload) error {
				called = true
				return nil
			},
		}
		videoRepo := &mockVideoRepo{}
		uc := upload.NewUsecase(uploadRepo, videoRepo, nil, cfg, logger)
		uc.Invoke(t.Context(), uploadEvent.CompletedEvent{ID: "", Filename: ""})
		if called {
			t.Fatalf("expected repo not to be called for empty ID")
		}
	})

	t.Run("upsert error logged", func(t *testing.T) {
		uploadRepo := &mockUploadRepo{
			upsertFunc: func(_ context.Context, _ domainUpload.Upload) error {
				return errors.New("db error")
			},
		}
		videoRepo := &mockVideoRepo{}
		uc := upload.NewUsecase(uploadRepo, videoRepo, nil, cfg, logger)
		uc.Invoke(
			t.Context(),
			uploadEvent.CompletedEvent{ID: "upload-1", Filename: "video.mp4"},
		)
	})
}

func TestUploadUsecase_VideoCompletion(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	cfg := config.MinIOConfig{Bucket: "test-bucket"}

	t.Run("upsert success and video updated", func(t *testing.T) {
		var saved domainUpload.Upload
		uploadRepo := &mockUploadRepo{
			upsertFunc: func(_ context.Context, u domainUpload.Upload) error {
				saved = u
				return nil
			},
		}

		existingVideo, err := domainVideo.Build(domainVideo.Attrs{
			ID:         "video-123",
			Title:      "Test Video",
			Visibility: vo.Public,
			Status:     vo.StatusNotReady,
		})
		if err != nil {
			t.Fatalf("failed to build video: %v", err)
		}

		var updatedVideo domainVideo.Video
		videoRepo := &mockVideoRepo{
			getByIDFunc: func(_ context.Context, id string) (domainVideo.Video, error) {
				if id == "video-123" {
					return *existingVideo, nil
				}
				return domainVideo.Video{}, errors.New("not found")
			},
			updateFunc: func(_ context.Context, v domainVideo.Video) (domainVideo.Video, error) {
				updatedVideo = v
				return v, nil
			},
		}

		uc := upload.NewUsecase(uploadRepo, videoRepo, nil, cfg, logger)
		uc.Invoke(
			t.Context(),
			uploadEvent.CompletedEvent{
				ID:         "upload-1",
				VideoID:    "video-123",
				Filename:   "video.mp4",
				Size:       1024,
				DurationMs: 5000,
				MimeType:   "video/mp4",
			},
		)

		if saved.TusID != "upload-1" || saved.Filename != "video.mp4" ||
			saved.Status != domainUpload.StatusCompleted {
			t.Fatalf("saved upload mismatch: %+v", saved)
		}

		if updatedVideo.FilePath() != "upload-1" || updatedVideo.FileSize() != 1024 ||
			updatedVideo.DurationMs() != 5000 ||
			updatedVideo.Status() != vo.StatusReady {
			t.Fatalf("updated video mismatch: %+v", updatedVideo)
		}
	})

	t.Run("video get by id error", func(t *testing.T) {
		uploadRepo := &mockUploadRepo{}
		videoRepo := &mockVideoRepo{
			getByIDFunc: func(_ context.Context, _ string) (domainVideo.Video, error) {
				return domainVideo.Video{}, errors.New("db error")
			},
		}
		uc := upload.NewUsecase(uploadRepo, videoRepo, nil, cfg, logger)
		uc.Invoke(
			t.Context(),
			uploadEvent.CompletedEvent{
				ID:       "upload-1",
				VideoID:  "video-123",
				Filename: "video.mp4",
			},
		)
	})

	t.Run("video update error", func(t *testing.T) {
		existingVideo, _ := domainVideo.Build(domainVideo.Attrs{
			ID:         "video-123",
			Title:      "Test Video",
			Visibility: vo.Public,
			Status:     vo.StatusNotReady,
		})
		uploadRepo := &mockUploadRepo{}
		videoRepo := &mockVideoRepo{
			getByIDFunc: func(_ context.Context, _ string) (domainVideo.Video, error) {
				return *existingVideo, nil
			},
			updateFunc: func(_ context.Context, _ domainVideo.Video) (domainVideo.Video, error) {
				return domainVideo.Video{}, errors.New("update error")
			},
		}
		uc := upload.NewUsecase(uploadRepo, videoRepo, nil, cfg, logger)
		uc.Invoke(
			t.Context(),
			uploadEvent.CompletedEvent{
				ID:       "upload-1",
				VideoID:  "video-123",
				Filename: "video.mp4",
			},
		)
	})
}

func TestUploadUsecase_DurationExtraction(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	cfg := config.MinIOConfig{Bucket: "test-bucket"}

	t.Run("with s3 client extract duration and empty mime", func(t *testing.T) {
		mp4Data := buildMinimalMP4WithDuration(30000, 1000)
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			rangeHeader := r.Header.Get("Range")
			if rangeHeader != "" && strings.HasPrefix(rangeHeader, "bytes=") {
				rangeSpec := strings.TrimPrefix(rangeHeader, "bytes=")
				parts := strings.Split(rangeSpec, "-")
				start, _ := strconv.ParseInt(parts[0], 10, 64)
				end, _ := strconv.ParseInt(parts[1], 10, 64)
				if end >= int64(len(mp4Data)) {
					end = int64(len(mp4Data)) - 1
				}
				w.Header().
					Set("Content-Range", "bytes "+strconv.FormatInt(start, 10)+"-"+strconv.FormatInt(end, 10)+"/"+strconv.Itoa(len(mp4Data)))
				w.WriteHeader(http.StatusPartialContent)
				_, _ = w.Write(mp4Data[start : end+1])
				return
			}
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write(mp4Data)
		}))
		defer server.Close()

		awsCfg, _ := awsconfig.LoadDefaultConfig(
			t.Context(),
			awsconfig.WithRegion("us-east-1"),
			awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider("k", "s", "")),
		)
		s3Client := s3.NewFromConfig(awsCfg, func(o *s3.Options) {
			o.BaseEndpoint = aws.String(server.URL)
			o.UsePathStyle = true
		})

		existingVideo, _ := domainVideo.Build(domainVideo.Attrs{
			ID:         "video-123",
			Title:      "Test Video",
			Visibility: vo.Public,
			Status:     vo.StatusNotReady,
		})

		var updatedVideo domainVideo.Video
		videoRepo := &mockVideoRepo{
			getByIDFunc: func(_ context.Context, _ string) (domainVideo.Video, error) {
				return *existingVideo, nil
			},
			updateFunc: func(_ context.Context, v domainVideo.Video) (domainVideo.Video, error) {
				updatedVideo = v
				return v, nil
			},
		}

		uploadRepo := &mockUploadRepo{}
		uc := upload.NewUsecase(uploadRepo, videoRepo, s3Client, cfg, logger)
		uc.Invoke(
			t.Context(),
			uploadEvent.CompletedEvent{
				ID:       "upload-1",
				VideoID:  "video-123",
				Filename: "video.mp4",
				Size:     int64(len(mp4Data)),
			},
		)

		if updatedVideo.DurationMs() != 30000 {
			t.Fatalf("expected 30000 ms, got %d", updatedVideo.DurationMs())
		}
	})

	t.Run("with s3 client extract duration error falls back to event duration", func(t *testing.T) {
		existingVideo, _ := domainVideo.Build(domainVideo.Attrs{
			ID:         "video-123",
			Title:      "Test Video",
			Visibility: vo.Public,
			Status:     vo.StatusNotReady,
		})

		var updatedVideo domainVideo.Video
		videoRepo := &mockVideoRepo{
			getByIDFunc: func(_ context.Context, _ string) (domainVideo.Video, error) {
				return *existingVideo, nil
			},
			updateFunc: func(_ context.Context, v domainVideo.Video) (domainVideo.Video, error) {
				updatedVideo = v
				return v, nil
			},
		}

		awsCfg, _ := awsconfig.LoadDefaultConfig(
			t.Context(),
			awsconfig.WithRegion("us-east-1"),
			awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider("k", "s", "")),
		)
		s3Client := s3.NewFromConfig(awsCfg)

		uploadRepo := &mockUploadRepo{}
		uc := upload.NewUsecase(uploadRepo, videoRepo, s3Client, cfg, logger)
		// Size: 4 triggers parse error in ExtractMP4DurationMs
		uc.Invoke(
			t.Context(),
			uploadEvent.CompletedEvent{
				ID:         "upload-1",
				VideoID:    "video-123",
				Filename:   "video.mp4",
				Size:       4,
				DurationMs: 4500,
			},
		)

		if updatedVideo.DurationMs() != 4500 {
			t.Fatalf("expected 4500 ms, got %d", updatedVideo.DurationMs())
		}
	})
}
