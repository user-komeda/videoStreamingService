package upload

import (
	"context"
	"fmt"
	"log/slog"

	domainEntity "videoStreaming/domain/entity/upload"
	domain "videoStreaming/domain/repository/upload"
	"videoStreaming/infrastructure/entity/upload"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewRepository(db *gorm.DB, logger *slog.Logger) *Repository {
	return &Repository{db: db, logger: logger}
}

func (r *Repository) Upsert(ctx context.Context, u domainEntity.Upload) error {
	model := upload.Entity{
		ID:       "",
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
		return fmt.Errorf("failed to save upload: %w", tx.Error)
	}
	r.logger.InfoContext(ctx, "upload record upserted", "rows", tx.RowsAffected, "id", model.ID)
	return nil
}

var _ domain.Repository = (*Repository)(nil)
