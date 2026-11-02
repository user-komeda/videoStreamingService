package user

import (
	"errors"
	"time"

	domain "videoStreaming/domain/entity/user"
	infraEntity "videoStreaming/infrastructure/entity"
)

type Entity struct {
	ID           string    `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Email        string    `gorm:"type:text;not null;uniqueIndex:idx_users_email"`
	PasswordHash string    `gorm:"type:text;not null"`
	CreatedAt    time.Time `gorm:"type:timestamptz;not null;default:now()"`
	UpdatedAt    time.Time `gorm:"type:timestamptz;not null;default:now()"`
}

func BuildFromDomainEntity(u *domain.User) (*Entity, error) {
	if u == nil {
		return nil, errors.New("user entity is nil")
	}

	return &Entity{
		ID:           u.ID(),
		Email:        u.Email(),
		PasswordHash: u.PasswordHash(),
		CreatedAt:    u.CreatedAt(),
		UpdatedAt:    u.UpdatedAt(),
	}, nil
}

func (e *Entity) ToDomain() (*domain.User, error) {
	attrs := domain.Attrs{
		ID:           e.ID,
		Email:        e.Email,
		PasswordHash: e.PasswordHash,
		CreatedAt:    e.CreatedAt,
		UpdatedAt:    e.UpdatedAt,
	}

	return domain.Build(attrs)
}

func (*Entity) TableName() string {
	return "users"
}

var _ infraEntity.DomainConverter[*domain.User] = (*Entity)(nil)
var _ infraEntity.InfraEntityBuilderFunc[*domain.User, *Entity] = BuildFromDomainEntity
