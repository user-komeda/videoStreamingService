package video

import (
	"context"
	"log/slog"

	videoDto "videoStreaming/application/dto/video"
	appErrors "videoStreaming/application/errors"
	"videoStreaming/application/usecase"
	"videoStreaming/domain/repository/video"
)

type GetAllUseCase struct {
	repo   video.Repository
	logger *slog.Logger
}

func NewGetAllUseCase(repo video.Repository, logger *slog.Logger) *GetAllUseCase {
	return &GetAllUseCase{repo: repo, logger: logger}
}

func (g *GetAllUseCase) Invoke(ctx context.Context) ([]*videoDto.Dto, error) {
	videos, err := g.repo.GetAll(ctx)
	if err != nil {
		g.logger.ErrorContext(ctx, "failed to get all videos", "error", err)
		return nil, appErrors.FromDomainError(err, "failed to get all videos")
	}

	return videoDto.FromDomainList(videos), nil
}

var _ usecase.NoInputUseCase[[]*videoDto.Dto] = (*GetAllUseCase)(nil)
