package video

import (
	"context"
	"fmt"
	"log/slog"

	domainVideo "videoStreaming/domain/entity/video"
	domainErrors "videoStreaming/domain/errors"
	domainRepo "videoStreaming/domain/repository/video"
	infraEntity "videoStreaming/infrastructure/entity/video"
	infraErrors "videoStreaming/infrastructure/errors"

	"gorm.io/gorm"
)

type Repository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewRepository(db *gorm.DB, logger *slog.Logger) *Repository {
	return &Repository{db: db, logger: logger}
}

func (r *Repository) GetAll(ctx context.Context) ([]domainVideo.Video, error) {
	var entities []infraEntity.Entity
	if err := r.db.WithContext(ctx).Find(&entities).Error; err != nil {
		r.logger.ErrorContext(ctx, "failed to get all videos", "error", err)
		return nil, infraErrors.MapDBError(err)
	}

	videos := make([]domainVideo.Video, 0, len(entities))
	for _, entity := range entities {
		v, err := entity.ToDomain()
		if err != nil {
			r.logger.ErrorContext(
				ctx,
				"failed to map video entity to domain",
				"id",
				entity.ID,
				"error",
				err,
			)
			return nil, fmt.Errorf("%w: %w", domainErrors.ErrInternal, err)
		}
		videos = append(videos, *v)
	}

	return videos, nil
}

func (r *Repository) GetByID(ctx context.Context, id string) (domainVideo.Video, error) {
	var entity infraEntity.Entity
	if err := r.db.WithContext(ctx).First(&entity, "id = ?", id).Error; err != nil {
		r.logger.ErrorContext(ctx, "failed to get video by id", "id", id, "error", err)
		return domainVideo.Video{}, infraErrors.MapDBError(err)
	}

	video, err := entity.ToDomain()
	if err != nil {
		r.logger.ErrorContext(
			ctx,
			"failed to map video entity to domain",
			"id",
			entity.ID,
			"error",
			err,
		)
		return domainVideo.Video{}, fmt.Errorf("%w: %w", domainErrors.ErrInternal, err)
	}

	return *video, nil
}

func (r *Repository) Create(
	ctx context.Context,
	v domainVideo.Video,
) (domainVideo.Video, error) {
	entityPtr, _ := infraEntity.BuildFromDomainEntity(&v)

	if err := r.db.WithContext(ctx).Create(entityPtr).Error; err != nil {
		r.logger.ErrorContext(ctx, "failed to create video", "error", err)
		return domainVideo.Video{}, infraErrors.MapDBError(err)
	}

	createdVideo, _ := entityPtr.ToDomain()
	r.logger.InfoContext(ctx, "video created successfully", "id", createdVideo.ID())
	return *createdVideo, nil
}

func (r *Repository) Update(
	ctx context.Context,
	v domainVideo.Video,
) (domainVideo.Video, error) {
	entityPtr, _ := infraEntity.BuildFromDomainEntity(&v)

	if err := r.db.WithContext(ctx).Save(entityPtr).Error; err != nil {
		r.logger.ErrorContext(ctx, "failed to update video", "id", entityPtr.ID, "error", err)
		return domainVideo.Video{}, infraErrors.MapDBError(err)
	}

	updatedVideo, _ := entityPtr.ToDomain()
	r.logger.InfoContext(ctx, "video updated successfully", "id", updatedVideo.ID())
	return *updatedVideo, nil
}

func (r *Repository) Delete(ctx context.Context, id string) error {
	tx := r.db.WithContext(ctx).Delete(&infraEntity.Entity{}, "id = ?", id)
	if tx.Error != nil {
		r.logger.ErrorContext(ctx, "failed to delete video", "id", id, "error", tx.Error)
		return infraErrors.MapDBError(tx.Error)
	}

	r.logger.InfoContext(
		ctx,
		"video deleted successfully",
		"id",
		id,
		"rowsAffected",
		tx.RowsAffected,
	)
	return nil
}

var _ domainRepo.Repository = (*Repository)(nil)
