package user

import (
	"context"
	"videoStreaming/domain/entity/user"
)

type Repository interface {
	Create(ctx context.Context, u *user.User) error
	FindByEmail(ctx context.Context, email string) (*user.User, error)
	FindByID(ctx context.Context, id string) (*user.User, error)
}
