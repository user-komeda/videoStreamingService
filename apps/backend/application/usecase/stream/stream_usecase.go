package stream

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"net/http"

	appErrors "videoStreaming/application/errors"
	"videoStreaming/config"
	domainVideoRepo "videoStreaming/domain/repository/video"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	s3types "github.com/aws/aws-sdk-go-v2/service/s3/types"
)

type Output struct {
	Body          io.ReadCloser
	ContentLength int64
	ContentRange  string
	ContentType   string
	StatusCode    int
	AcceptRanges  string
}

type UseCase struct {
	videoRepo domainVideoRepo.Repository
	s3Client  *s3.Client
	bucket    string
	logger    *slog.Logger
}

func NewUseCase(
	videoRepo domainVideoRepo.Repository,
	s3Client *s3.Client,
	cfg config.MinIOConfig,
	logger *slog.Logger,
) *UseCase {
	return &UseCase{
		videoRepo: videoRepo,
		s3Client:  s3Client,
		bucket:    cfg.Bucket,
		logger:    logger,
	}
}

func (u *UseCase) Invoke(ctx context.Context, videoID string, rangeHeader string) (*Output, error) {
	if videoID == "" {
		return nil, appErrors.NewAppError(appErrors.CodeInvalidArgument, "video id is required", nil)
	}

	video, err := u.videoRepo.GetByID(ctx, videoID)
	if err != nil {
		u.logger.ErrorContext(ctx, "video not found for stream", "id", videoID, "error", err)
		return nil, appErrors.FromDomainError(err, "video not found")
	}

	if video.FilePath() == "" {
		return nil, appErrors.NewAppError(appErrors.CodeNotFound, "video file not uploaded yet", nil)
	}

	input := &s3.GetObjectInput{
		Bucket: aws.String(u.bucket),
		Key:    aws.String(video.FilePath()),
	}

	isRangeRequest := false
	if rangeHeader != "" {
		input.Range = aws.String(rangeHeader)
		isRangeRequest = true
	}

	resp, err := u.s3Client.GetObject(ctx, input)
	if err != nil {
		u.logger.ErrorContext(ctx, "failed to get object from storage", "key", video.FilePath(), "error", err)
		if _, ok := errors.AsType[*s3types.NoSuchKey](err); ok {
			return nil, appErrors.NewAppError(appErrors.CodeNotFound, "video file not found in storage", err)
		}
		return nil, appErrors.NewAppError(appErrors.CodeInternal, "failed to fetch video stream", err)
	}

	contentType := "video/mp4"
	if resp.ContentType != nil && *resp.ContentType != "" && *resp.ContentType != "application/octet-stream" {
		contentType = *resp.ContentType
	} else if video.MimeType() != nil {
		contentType = video.MimeType().String()
	}

	statusCode := http.StatusOK
	contentRange := ""
	if resp.ContentRange != nil {
		contentRange = *resp.ContentRange
		statusCode = http.StatusPartialContent
	} else if isRangeRequest {
		statusCode = http.StatusPartialContent
	}

	var contentLength int64
	if resp.ContentLength != nil {
		contentLength = *resp.ContentLength
	}

	return &Output{
		Body:          resp.Body,
		ContentLength: contentLength,
		ContentRange:  contentRange,
		ContentType:   contentType,
		StatusCode:    statusCode,
		AcceptRanges:  "bytes",
	}, nil
}
