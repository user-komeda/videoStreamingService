package repository

import (
	"context"

	"videoStreaming/domain/entity"
)

// UploadRepository is a domain-owned boundary.
type UploadRepository interface {
	Upsert(ctx context.Context, u entity.Upload) error
}
