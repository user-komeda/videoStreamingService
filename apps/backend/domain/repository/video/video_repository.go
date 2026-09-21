package video

import (
	"context"

	"videoStreaming/domain/entity/video"
)

type Repository interface {
	GetAll(ctx context.Context) ([]video.Video, error)
	GetByID(ctx context.Context, id string) (video.Video, error)
	Create(ctx context.Context, v video.Video) (video.Video, error)
	Update(ctx context.Context, v video.Video) (video.Video, error)
	Delete(ctx context.Context, id string) error
}
