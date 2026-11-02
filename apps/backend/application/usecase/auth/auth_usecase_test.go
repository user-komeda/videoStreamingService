package auth_test

import (
	"context"
	"errors"
	"log/slog"
	"testing"
	"time"

	authDto "videoStreaming/application/dto/auth"
	appErrors "videoStreaming/application/errors"
	usecaseAuth "videoStreaming/application/usecase/auth"
	domainUser "videoStreaming/domain/entity/user"
	domainErrors "videoStreaming/domain/errors"
	infraAuth "videoStreaming/infrastructure/auth"
)

type mockUserRepo struct {
	createFn      func(ctx context.Context, u *domainUser.User) error
	findByEmailFn func(ctx context.Context, email string) (*domainUser.User, error)
	findByIDFn    func(ctx context.Context, id string) (*domainUser.User, error)
}

func (m *mockUserRepo) Create(ctx context.Context, u *domainUser.User) error {
	if m.createFn != nil {
		return m.createFn(ctx, u)
	}
	return nil
}

func (m *mockUserRepo) FindByEmail(ctx context.Context, email string) (*domainUser.User, error) {
	if m.findByEmailFn != nil {
		return m.findByEmailFn(ctx, email)
	}
	return nil, domainErrors.ErrNotFound
}

func (m *mockUserRepo) FindByID(ctx context.Context, id string) (*domainUser.User, error) {
	if m.findByIDFn != nil {
		return m.findByIDFn(ctx, id)
	}
	return nil, domainErrors.ErrNotFound
}

type mockPasswordService struct {
	hashFn    func(password string) (string, error)
	compareFn func(hash, password string) error
}

func (m *mockPasswordService) HashPassword(password string) (string, error) {
	if m.hashFn != nil {
		return m.hashFn(password)
	}
	return "hashed-" + password, nil
}

func (m *mockPasswordService) ComparePassword(hash, password string) error {
	if m.compareFn != nil {
		return m.compareFn(hash, password)
	}
	return nil
}

func TestSignUpUseCase_Success(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	repo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, _ string) (*domainUser.User, error) {
			return nil, domainErrors.ErrNotFound
		},
		createFn: func(_ context.Context, u *domainUser.User) error {
			if u.Email() != "new@example.com" {
				t.Errorf("unexpected email: %s", u.Email())
			}
			return nil
		},
	}
	pwdSvc := &mockPasswordService{}

	uc := usecaseAuth.NewSignUpUseCase(repo, pwdSvc, logger)
	result, err := uc.Invoke(context.Background(), authDto.SignUpInput{
		Email:    "new@example.com",
		Password: "password123",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.UserID == "" {
		t.Errorf("expected generated userID")
	}
}

func TestSignUpUseCase_AlreadyExists(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	existingUser, _ := domainUser.Build(domainUser.Attrs{
		ID:           "u1",
		Email:        "existing@example.com",
		PasswordHash: "hash",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	})
	repo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, _ string) (*domainUser.User, error) {
			return existingUser, nil
		},
	}
	pwdSvc := &mockPasswordService{}

	uc := usecaseAuth.NewSignUpUseCase(repo, pwdSvc, logger)
	_, err := uc.Invoke(context.Background(), authDto.SignUpInput{
		Email:    "existing@example.com",
		Password: "password123",
	})
	if err == nil {
		t.Fatalf("expected conflict error, got nil")
	}

	if appErr, ok := errors.AsType[*appErrors.AppError](err); ok {
		if appErr.Code != appErrors.CodeConflict {
			t.Errorf("expected CodeConflict, got %s", appErr.Code)
		}
	} else {
		t.Errorf("expected AppError, got %v", err)
	}
}

func TestSignUpUseCase_HashError(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	repo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, _ string) (*domainUser.User, error) {
			return nil, domainErrors.ErrNotFound
		},
	}
	pwdSvc := &mockPasswordService{
		hashFn: func(_ string) (string, error) {
			return "", errors.New("hash failed")
		},
	}

	uc := usecaseAuth.NewSignUpUseCase(repo, pwdSvc, logger)
	_, err := uc.Invoke(context.Background(), authDto.SignUpInput{
		Email:    "new@example.com",
		Password: "password123",
	})
	if err == nil {
		t.Fatalf("expected error on hash failure, got nil")
	}
}

func TestSignUpUseCase_FindByEmailError(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	repo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, _ string) (*domainUser.User, error) {
			return nil, errors.New("database connection failed")
		},
	}
	pwdSvc := &mockPasswordService{}

	uc := usecaseAuth.NewSignUpUseCase(repo, pwdSvc, logger)
	_, err := uc.Invoke(context.Background(), authDto.SignUpInput{
		Email:    "new@example.com",
		Password: "password123",
	})
	if err == nil {
		t.Fatalf("expected error on repo find error, got nil")
	}

	if appErr, ok := errors.AsType[*appErrors.AppError](err); ok {
		if appErr.Code != appErrors.CodeInternal {
			t.Errorf("expected CodeInternal, got %s", appErr.Code)
		}
	} else {
		t.Errorf("expected AppError, got %v", err)
	}
}

func TestSignUpUseCase_CreateError(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	repo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, _ string) (*domainUser.User, error) {
			return nil, domainErrors.ErrNotFound
		},
		createFn: func(_ context.Context, _ *domainUser.User) error {
			return errors.New("database write failed")
		},
	}
	pwdSvc := &mockPasswordService{}

	uc := usecaseAuth.NewSignUpUseCase(repo, pwdSvc, logger)
	_, err := uc.Invoke(context.Background(), authDto.SignUpInput{
		Email:    "new@example.com",
		Password: "password123",
	})
	if err == nil {
		t.Fatalf("expected error on create failure, got nil")
	}

	if appErr, ok := errors.AsType[*appErrors.AppError](err); ok {
		if appErr.Code != appErrors.CodeInternal {
			t.Errorf("expected CodeInternal, got %s", appErr.Code)
		}
	} else {
		t.Errorf("expected AppError, got %v", err)
	}
}

func TestSignInUseCase_Success(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	existingUser, _ := domainUser.Build(domainUser.Attrs{
		ID:           "u123",
		Email:        "user@example.com",
		PasswordHash: "hashed-pw",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	})
	repo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, _ string) (*domainUser.User, error) {
			return existingUser, nil
		},
	}
	pwdSvc := &mockPasswordService{
		compareFn: func(_, _ string) error {
			return nil
		},
	}

	uc := usecaseAuth.NewSignInUseCase(repo, pwdSvc, logger)
	result, err := uc.Invoke(context.Background(), authDto.SignInInput{
		Email:    "user@example.com",
		Password: "password123",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.UserID != "u123" {
		t.Errorf("expected userID 'u123', got %s", result.UserID)
	}
}

func TestSignInUseCase_UserNotFound(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	repo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, _ string) (*domainUser.User, error) {
			return nil, domainErrors.ErrNotFound
		},
	}
	pwdSvc := &mockPasswordService{}

	uc := usecaseAuth.NewSignInUseCase(repo, pwdSvc, logger)
	_, err := uc.Invoke(context.Background(), authDto.SignInInput{
		Email:    "nonexistent@example.com",
		Password: "password123",
	})
	if err == nil {
		t.Fatalf("expected unauthorized error, got nil")
	}

	if appErr, ok := errors.AsType[*appErrors.AppError](err); ok {
		if appErr.Code != appErrors.CodeUnauthorized {
			t.Errorf("expected CodeUnauthorized, got %s", appErr.Code)
		}
	} else {
		t.Errorf("expected AppError, got %v", err)
	}
}

func TestSignInUseCase_PasswordMismatch(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	existingUser, _ := domainUser.Build(domainUser.Attrs{
		ID:           "u123",
		Email:        "user@example.com",
		PasswordHash: "hashed-pw",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	})
	repo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, _ string) (*domainUser.User, error) {
			return existingUser, nil
		},
	}
	pwdSvc := &mockPasswordService{
		compareFn: func(_, _ string) error {
			return infraAuth.ErrPasswordMismatch
		},
	}

	uc := usecaseAuth.NewSignInUseCase(repo, pwdSvc, logger)
	_, err := uc.Invoke(context.Background(), authDto.SignInInput{
		Email:    "user@example.com",
		Password: "wrongpassword",
	})
	if err == nil {
		t.Fatalf("expected unauthorized error, got nil")
	}

	if appErr, ok := errors.AsType[*appErrors.AppError](err); ok {
		if appErr.Code != appErrors.CodeUnauthorized {
			t.Errorf("expected CodeUnauthorized, got %s", appErr.Code)
		}
	} else {
		t.Errorf("expected AppError, got %v", err)
	}
}

func TestSignInUseCase_FindByEmailError(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	repo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, _ string) (*domainUser.User, error) {
			return nil, errors.New("database connection failed")
		},
	}
	pwdSvc := &mockPasswordService{}

	uc := usecaseAuth.NewSignInUseCase(repo, pwdSvc, logger)
	_, err := uc.Invoke(context.Background(), authDto.SignInInput{
		Email:    "user@example.com",
		Password: "password123",
	})
	if err == nil {
		t.Fatalf("expected error on repo find error, got nil")
	}

	if appErr, ok := errors.AsType[*appErrors.AppError](err); ok {
		if appErr.Code != appErrors.CodeInternal {
			t.Errorf("expected CodeInternal, got %s", appErr.Code)
		}
	} else {
		t.Errorf("expected AppError, got %v", err)
	}
}

func TestSignInUseCase_ComparePasswordError(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	existingUser, _ := domainUser.Build(domainUser.Attrs{
		ID:           "u123",
		Email:        "user@example.com",
		PasswordHash: "hashed-pw",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	})
	repo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, _ string) (*domainUser.User, error) {
			return existingUser, nil
		},
	}
	pwdSvc := &mockPasswordService{
		compareFn: func(_, _ string) error {
			return errors.New("unexpected bcrypt error")
		},
	}

	uc := usecaseAuth.NewSignInUseCase(repo, pwdSvc, logger)
	_, err := uc.Invoke(context.Background(), authDto.SignInInput{
		Email:    "user@example.com",
		Password: "password123",
	})
	if err == nil {
		t.Fatalf("expected error on compare failure, got nil")
	}

	if appErr, ok := errors.AsType[*appErrors.AppError](err); ok {
		if appErr.Code != appErrors.CodeInternal {
			t.Errorf("expected CodeInternal, got %s", appErr.Code)
		}
	} else {
		t.Errorf("expected AppError, got %v", err)
	}
}
