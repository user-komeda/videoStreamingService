package video

import (
	"context"
	"log/slog"

	videoDto "videoStreaming/application/dto/video"
	appErrors "videoStreaming/application/errors"
	"videoStreaming/application/usecase"
	"videoStreaming/domain/repository/video"
)

type UpdateUseCase struct {
	repo   video.Repository
	logger *slog.Logger
}

func NewUpdateUseCase(repo video.Repository, logger *slog.Logger) *UpdateUseCase {
	return &UpdateUseCase{repo: repo, logger: logger}
}

func (u *UpdateUseCase) Invoke(ctx context.Context, input *videoDto.UpdateVideoDto) error {
	existing, err := u.repo.GetByID(ctx, input.ID())
	if err != nil {
		u.logger.ErrorContext(ctx, "failed to get video for update", "id", input.ID(), "error", err)
		return appErrors.FromDomainError(err, "video not found")
	}

	if updateErr := existing.UpdateMetadata(input.ToUpdateParams()); updateErr != nil {
		u.logger.ErrorContext(
			ctx,
			"failed to update video metadata",
			"id",
			input.ID(),
			"error",
			updateErr,
		)
		return appErrors.FromDomainError(updateErr, "invalid video data")
	}

	if _, saveErr := u.repo.Update(ctx, existing); saveErr != nil {
		u.logger.ErrorContext(ctx, "failed to save updated video", "id", input.ID(), "error", saveErr)
		return appErrors.FromDomainError(saveErr, "failed to update video")
	}

	return nil
}

var _ usecase.NoOutputUseCase[*videoDto.UpdateVideoDto] = (*UpdateUseCase)(nil)
