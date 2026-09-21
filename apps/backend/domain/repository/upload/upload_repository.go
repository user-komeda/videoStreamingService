package upload

import (
	"context"

	"videoStreaming/domain/entity/upload"
)

type Repository interface {
	Upsert(ctx context.Context, u upload.Upload) error
}
