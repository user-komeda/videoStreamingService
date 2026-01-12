package repository

import (
	"context"
	"log/slog"
	domainEntity "videoStreaming/domain/entity"
	domain "videoStreaming/domain/repository"
	"videoStreaming/infrastructure/entity"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type UploadRepository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewUploadRepository(db *gorm.DB, logger *slog.Logger) *UploadRepository {
	return &UploadRepository{db: db, logger: logger}
}

func (r *UploadRepository) Upsert(ctx context.Context, u domainEntity.Upload) error {
	model := entity.UploadEntity{
		Filename: u.Filename,
		Status:   string(u.Status),
		TusID:    u.TusID,
	}
	tx := r.db.WithContext(ctx).
		Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "tus_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"filename", "status"}),
		}).
		Create(&model)

	if tx.Error != nil {
		r.logger.ErrorContext(ctx, "failed to save upload in repository", "error", tx.Error)
		return tx.Error
	}
	r.logger.InfoContext(ctx, "upload record upserted", "rows", tx.RowsAffected, "id", model.ID)
	return nil
}

var _ domain.UploadRepository = (*UploadRepository)(nil)
