package auth

import (
	"context"
	"errors"
	"log/slog"
	"time"

	authDto "videoStreaming/application/dto/auth"
	appErrors "videoStreaming/application/errors"
	domainUser "videoStreaming/domain/entity/user"
	domainErrors "videoStreaming/domain/errors"
	userRepo "videoStreaming/domain/repository/user"
	infraAuth "videoStreaming/infrastructure/auth"

	"github.com/google/uuid"
)

type SignUpUseCase interface {
	Invoke(ctx context.Context, input authDto.SignUpInput) (*authDto.ResultDto, error)
}

type signUpUseCaseImpl struct {
	userRepo        userRepo.Repository
	passwordService infraAuth.PasswordService
	logger          *slog.Logger
}

func NewSignUpUseCase(
	userRepo userRepo.Repository,
	passwordService infraAuth.PasswordService,
	logger *slog.Logger,
) SignUpUseCase {
	return &signUpUseCaseImpl{
		userRepo:        userRepo,
		passwordService: passwordService,
		logger:          logger,
	}
}

func (u *signUpUseCaseImpl) Invoke(ctx context.Context, input authDto.SignUpInput) (*authDto.ResultDto, error) {
	existingUser, findErr := u.userRepo.FindByEmail(ctx, input.Email)
	if findErr != nil && !errors.Is(findErr, domainErrors.ErrNotFound) {
		u.logger.ErrorContext(ctx, "failed to check existing user", "email", input.Email, "error", findErr)
		return nil, appErrors.NewAppError(appErrors.CodeInternal, "failed to check existing user", findErr)
	}
	if existingUser != nil {
		return nil, appErrors.NewAppError(appErrors.CodeConflict, "user with this email already exists", nil)
	}

	passwordHash, hashErr := u.passwordService.HashPassword(input.Password)
	if hashErr != nil {
		u.logger.ErrorContext(ctx, "failed to hash password", "error", hashErr)
		return nil, appErrors.NewAppError(appErrors.CodeInternal, "failed to hash password", hashErr)
	}

	userID := uuid.New().String()
	now := time.Now()
	userEntity, _ := domainUser.Build(domainUser.Attrs{
		ID:           userID,
		Email:        input.Email,
		PasswordHash: passwordHash,
		CreatedAt:    now,
		UpdatedAt:    now,
	})

	if createErr := u.userRepo.Create(ctx, userEntity); createErr != nil {
		u.logger.ErrorContext(ctx, "failed to save user", "email", input.Email, "error", createErr)
		return nil, appErrors.NewAppError(appErrors.CodeInternal, "failed to save user", createErr)
	}

	return &authDto.ResultDto{
		UserID: userID,
	}, nil
}
