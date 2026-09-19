package video

import (
	"context"
	"log/slog"

	videoDto "videoStreaming/application/dto/video"
	appErrors "videoStreaming/application/errors"
	"videoStreaming/application/usecase"
	"videoStreaming/domain/repository/video"
)

type GetDetailUseCase struct {
	repo   video.Repository
	logger *slog.Logger
}

func NewGetDetailUseCase(repo video.Repository, logger *slog.Logger) *GetDetailUseCase {
	return &GetDetailUseCase{repo: repo, logger: logger}
}

func (g *GetDetailUseCase) Invoke(ctx context.Context, input string) (*videoDto.Dto, error) {
	v, err := g.repo.GetByID(ctx, input)
	if err != nil {
		g.logger.ErrorContext(ctx, "failed to get video by id", "id", input, "error", err)
		return nil, appErrors.FromDomainError(err, "video not found")
	}

	return videoDto.FromDomain(v), nil
}

var _ usecase.UseCase[string, *videoDto.Dto] = (*GetDetailUseCase)(nil)
