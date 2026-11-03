package auth

import (
	"context"
	"errors"
	"log/slog"

	authDto "videoStreaming/application/dto/auth"
	appErrors "videoStreaming/application/errors"
	domainErrors "videoStreaming/domain/errors"
	userRepo "videoStreaming/domain/repository/user"
	infraAuth "videoStreaming/infrastructure/auth"
)

type SignInUseCase interface {
	Invoke(ctx context.Context, input authDto.SignInInput) (*authDto.ResultDto, error)
}

type signInUseCaseImpl struct {
	userRepo        userRepo.Repository
	passwordService infraAuth.PasswordService
	logger          *slog.Logger
}

func NewSignInUseCase(
	userRepo userRepo.Repository,
	passwordService infraAuth.PasswordService,
	logger *slog.Logger,
) SignInUseCase {
	return &signInUseCaseImpl{
		userRepo:        userRepo,
		passwordService: passwordService,
		logger:          logger,
	}
}

func (u *signInUseCaseImpl) Invoke(ctx context.Context, input authDto.SignInInput) (*authDto.ResultDto, error) {
	existingUser, findErr := u.userRepo.FindByEmail(ctx, input.Email)
	if findErr != nil {
		if errors.Is(findErr, domainErrors.ErrNotFound) {
			return nil, appErrors.NewAppError(appErrors.CodeUnauthorized, "invalid email or password", nil)
		}
		u.logger.ErrorContext(ctx, "failed to find user by email", "email", input.Email, "error", findErr)
		return nil, appErrors.NewAppError(appErrors.CodeInternal, "failed to find user", findErr)
	}

	if compErr := u.passwordService.ComparePassword(existingUser.PasswordHash(), input.Password); compErr != nil {
		if errors.Is(compErr, infraAuth.ErrPasswordMismatch) {
			return nil, appErrors.NewAppError(appErrors.CodeUnauthorized, "invalid email or password", nil)
		}
		u.logger.ErrorContext(ctx, "failed to compare password", "email", input.Email, "error", compErr)
		return nil, appErrors.NewAppError(appErrors.CodeInternal, "failed to verify password", compErr)
	}

	return &authDto.ResultDto{
		UserID: existingUser.ID(),
	}, nil
}
