package video

import (
	"context"
	"log/slog"

	appErrors "videoStreaming/application/errors"
	"videoStreaming/application/usecase"
	"videoStreaming/domain/repository/video"
)

type DeleteUseCase struct {
	repo   video.Repository
	logger *slog.Logger
}

func NewDeleteUseCase(repo video.Repository, logger *slog.Logger) *DeleteUseCase {
	return &DeleteUseCase{repo: repo, logger: logger}
}

func (u *DeleteUseCase) Invoke(ctx context.Context, input string) error {
	if err := u.repo.Delete(ctx, input); err != nil {
		u.logger.ErrorContext(ctx, "failed to delete video", "id", input, "error", err)
		return appErrors.FromDomainError(err, "failed to delete video")
	}

	return nil
}

var _ usecase.NoOutputUseCase[string] = (*DeleteUseCase)(nil)
