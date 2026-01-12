package upload

import (
	"context"
	"log/slog"
	"videoStreaming/domain/entity"
	"videoStreaming/domain/event"
	"videoStreaming/domain/repository"
)

type Usecase struct {
	repo   repository.UploadRepository
	logger *slog.Logger
}

func NewUsecase(repo repository.UploadRepository, logger *slog.Logger) *Usecase {
	return &Usecase{repo: repo, logger: logger}
}

func (u *Usecase) Invoke(ctx context.Context, e event.UploadCompletedEvent) {
	if e.ID == "" {
		return
	}

	err := u.repo.Upsert(ctx, entity.Upload{
		Filename: e.Filename,
		Status:   entity.UploadCompleted,
		TusID:    e.ID,
	})
	if err != nil {
		u.logger.ErrorContext(ctx, "failed to upsert metadata", "error", err)
		return
	}

	u.logger.InfoContext(ctx, "upload metadata upserted", "id", e.ID, "filename", e.Filename)
}

var _ event.UploadCompletedInvoker = (*Usecase)(nil)
