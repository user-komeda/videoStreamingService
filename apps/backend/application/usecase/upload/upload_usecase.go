package upload

import (
	"context"
	"log/slog"

	"videoStreaming/config"
	"videoStreaming/domain/entity/upload"
	domainEvent "videoStreaming/domain/event/upload"
	domainUploadRepo "videoStreaming/domain/repository/upload"
	domainVideoRepo "videoStreaming/domain/repository/video"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gabriel-vasile/mimetype"
)

type Usecase struct {
	uploadRepo domainUploadRepo.Repository
	videoRepo  domainVideoRepo.Repository
	s3Client   *s3.Client
	bucket     string
	logger     *slog.Logger
}

func NewUsecase(
	uploadRepo domainUploadRepo.Repository,
	videoRepo domainVideoRepo.Repository,
	s3Client *s3.Client,
	cfg config.MinIOConfig,
	logger *slog.Logger,
) *Usecase {
	return &Usecase{
		uploadRepo: uploadRepo,
		videoRepo:  videoRepo,
		s3Client:   s3Client,
		bucket:     cfg.Bucket,
		logger:     logger,
	}
}

func (u *Usecase) Invoke(ctx context.Context, e domainEvent.CompletedEvent) {
	if e.ID == "" {
		return
	}

	err := u.uploadRepo.Upsert(ctx, upload.Upload{
		ID:       "",
		Filename: e.Filename,
		Status:   upload.StatusCompleted,
		TusID:    e.ID,
	})
	if err != nil {
		u.logger.ErrorContext(ctx, "failed to upsert metadata", "error", err)
	} else {
		u.logger.InfoContext(ctx, "upload metadata upserted", "id", e.ID, "filename", e.Filename)
	}

	if e.VideoID != "" {
		u.handleVideoCompleted(ctx, e)
	}
}

func (u *Usecase) resolveDuration(ctx context.Context, e domainEvent.CompletedEvent) int64 {
	if u.s3Client == nil || u.bucket == "" || e.Size <= 0 {
		return e.DurationMs
	}

	extractedDuration := ExtractMP4DurationMs(ctx, u.s3Client, u.bucket, e.ID, e.Size)
	if extractedDuration > 0 {
		return extractedDuration
	}
	return e.DurationMs
}

func (u *Usecase) handleVideoCompleted(ctx context.Context, e domainEvent.CompletedEvent) {
	video, getErr := u.videoRepo.GetByID(ctx, e.VideoID)
	if getErr != nil {
		u.logger.ErrorContext(ctx, "failed to find video for upload", "videoId", e.VideoID, "error", getErr)
		return
	}

	var mime *mimetype.MIME
	if e.MimeType != "" {
		mime = mimetype.Lookup(e.MimeType)
	}

	durationMs := u.resolveDuration(ctx, e)
	video.MarkReady(e.ID, e.Size, mime, durationMs)

	if _, updateErr := u.videoRepo.Update(ctx, video); updateErr != nil {
		u.logger.ErrorContext(ctx, "failed to update video after upload", "videoId", e.VideoID, "error", updateErr)
		return
	}

	u.logger.InfoContext(
		ctx,
		"video updated with upload details",
		"videoId",
		e.VideoID,
		"filePath",
		e.ID,
		"durationMs",
		durationMs,
	)
}

var _ domainEvent.CompletedInvoker = (*Usecase)(nil)
