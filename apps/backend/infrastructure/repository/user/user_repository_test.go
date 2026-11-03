package user_test

import (
	"cmp"
	"context"
	"errors"
	"log/slog"
	"testing"
	"time"

	"videoStreaming/app"
	"videoStreaming/config"
	domainUser "videoStreaming/domain/entity/user"
	domainErrors "videoStreaming/domain/errors"
	infraEntity "videoStreaming/infrastructure/entity/user"
	userRepo "videoStreaming/infrastructure/repository/user"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	dsn := cmp.Or(
		config.GetEnv("DATABASE_URL"),
		config.GetEnv("DB_DSN"),
		config.DefaultConfig().DB.DSN,
	)

	db, err := app.NewGormDB(config.DBConfig{DSN: dsn})
	if err != nil {
		t.Skipf("skipping test: database connection failed: %v", err)
	}

	sqlDB, pingErr := db.DB()
	if pingErr != nil || sqlDB.Ping() != nil {
		t.Skipf("skipping test: cannot ping database")
	}

	if migrateErr := db.AutoMigrate(&infraEntity.Entity{}); migrateErr != nil {
		t.Fatalf("failed to auto migrate user entity: %v", migrateErr)
	}

	return db
}

func TestUserRepository_CRUD(t *testing.T) {
	db := setupTestDB(t)
	logger := slog.New(slog.DiscardHandler)
	repo := userRepo.NewRepository(db, logger)
	ctx := context.Background()

	testID := uuid.NewString()
	testEmail := "test-" + testID + "@example.com"
	now := time.Now().Truncate(time.Millisecond)

	user, err := domainUser.Build(domainUser.Attrs{
		ID:           testID,
		Email:        testEmail,
		PasswordHash: "hashed-pw-xyz",
		CreatedAt:    now,
		UpdatedAt:    now,
	})
	if err != nil {
		t.Fatalf("unexpected error building user: %v", err)
	}

	// 1. Create
	if createErr := repo.Create(ctx, user); createErr != nil {
		t.Fatalf("unexpected error creating user: %v", createErr)
	}

	// 2. FindByEmail
	foundByEmail, err := repo.FindByEmail(ctx, testEmail)
	if err != nil {
		t.Fatalf("unexpected error finding user by email: %v", err)
	}
	if foundByEmail.ID() != testID || foundByEmail.Email() != testEmail {
		t.Fatalf("found user mismatch: %+v", foundByEmail)
	}

	// 3. FindByID
	foundByID, err := repo.FindByID(ctx, testID)
	if err != nil {
		t.Fatalf("unexpected error finding user by id: %v", err)
	}
	if foundByID.ID() != testID || foundByID.Email() != testEmail {
		t.Fatalf("found user mismatch: %+v", foundByID)
	}

	// 4. FindByEmail not found
	_, err = repo.FindByEmail(ctx, "nonexistent-"+testID+"@example.com")
	if err == nil || !errors.Is(err, domainErrors.ErrNotFound) {
		t.Fatalf("expected ErrNotFound, got %v", err)
	}

	// 5. FindByID not found
	_, err = repo.FindByID(ctx, uuid.NewString())
	if err == nil || !errors.Is(err, domainErrors.ErrNotFound) {
		t.Fatalf("expected ErrNotFound, got %v", err)
	}
}

func TestUserRepository_Create_Nil(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	repo := userRepo.NewRepository(nil, logger)

	if err := repo.Create(context.Background(), nil); err == nil {
		t.Fatalf("expected error creating nil user, got nil")
	}
}

func TestUserRepository_ClosedDB(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	ctx := context.Background()
	closedDB, _ := app.NewGormDB(config.DBConfig{DSN: config.DefaultConfig().DB.DSN})
	if sDB, err := closedDB.DB(); err == nil {
		_ = sDB.Close()
	}
	closedRepo := userRepo.NewRepository(closedDB, logger)

	now := time.Now()
	testUser, _ := domainUser.Build(domainUser.Attrs{
		ID:           "test-id",
		Email:        "test@example.com",
		PasswordHash: "hash",
		CreatedAt:    now,
		UpdatedAt:    now,
	})

	if err := closedRepo.Create(ctx, testUser); err == nil {
		t.Errorf("expected error on Create with closed db")
	}
	if _, err := closedRepo.FindByEmail(ctx, "test@example.com"); err == nil {
		t.Errorf("expected error on FindByEmail with closed db")
	}
	if _, err := closedRepo.FindByID(ctx, "test-id"); err == nil {
		t.Errorf("expected error on FindByID with closed db")
	}
}
