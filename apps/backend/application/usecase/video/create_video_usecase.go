package video

import (
	"context"
	"log/slog"

	videoDto "videoStreaming/application/dto/video"
	appErrors "videoStreaming/application/errors"
	"videoStreaming/application/usecase"
	"videoStreaming/domain/repository/video"
)

type CreateUseCase struct {
	repo   video.Repository
	logger *slog.Logger
}

func NewCreateUseCase(repo video.Repository, logger *slog.Logger) *CreateUseCase {
	return &CreateUseCase{repo: repo, logger: logger}
}

func (u *CreateUseCase) Invoke(
	ctx context.Context,
	input *videoDto.CreateVideoDto,
) (*videoDto.Dto, error) {
	entity, err := input.ConvertToDomainEntity()
	if err != nil {
		u.logger.ErrorContext(ctx, "failed to convert dto to domain entity", "error", err)
		return nil, appErrors.FromDomainError(err, "invalid video data")
	}

	created, err := u.repo.Create(ctx, *entity)
	if err != nil {
		u.logger.ErrorContext(ctx, "failed to create video", "error", err)
		return nil, appErrors.FromDomainError(err, "failed to create video")
	}

	return videoDto.FromDomain(created), nil
}

var _ usecase.UseCase[*videoDto.CreateVideoDto, *videoDto.Dto] = (*CreateUseCase)(nil)
