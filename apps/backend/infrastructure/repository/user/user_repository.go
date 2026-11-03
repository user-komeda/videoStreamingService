package user

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	domainUser "videoStreaming/domain/entity/user"
	domainErrors "videoStreaming/domain/errors"
	domainRepo "videoStreaming/domain/repository/user"
	infraEntity "videoStreaming/infrastructure/entity/user"

	"gorm.io/gorm"
)

type Repository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewRepository(db *gorm.DB, logger *slog.Logger) domainRepo.Repository {
	return &Repository{
		db:     db,
		logger: logger,
	}
}

func (r *Repository) Create(ctx context.Context, u *domainUser.User) error {
	if u == nil {
		return errors.New("user entity is nil")
	}

	entityPtr, _ := infraEntity.BuildFromDomainEntity(u)

	if err := r.db.WithContext(ctx).Create(entityPtr).Error; err != nil {
		r.logger.ErrorContext(ctx, "failed to create user", "email", entityPtr.Email, "error", err)
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

func (r *Repository) FindByEmail(ctx context.Context, email string) (*domainUser.User, error) {
	var entity infraEntity.Entity
	if err := r.db.WithContext(ctx).First(&entity, "email = ?", email).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domainErrors.ErrNotFound
		}
		r.logger.ErrorContext(ctx, "failed to find user by email", "email", email, "error", err)
		return nil, fmt.Errorf("failed to find user by email: %w", err)
	}

	u, _ := entity.ToDomain()
	return u, nil
}

func (r *Repository) FindByID(ctx context.Context, id string) (*domainUser.User, error) {
	var entity infraEntity.Entity
	if err := r.db.WithContext(ctx).First(&entity, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domainErrors.ErrNotFound
		}
		r.logger.ErrorContext(ctx, "failed to find user by id", "id", id, "error", err)
		return nil, fmt.Errorf("failed to find user by id: %w", err)
	}

	u, _ := entity.ToDomain()
	return u, nil
}
