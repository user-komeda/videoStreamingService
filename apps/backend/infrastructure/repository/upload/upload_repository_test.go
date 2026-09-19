package upload_test

import (
	"cmp"
	"context"
	"log/slog"
	"testing"

	"videoStreaming/app"
	"videoStreaming/config"
	domainEntity "videoStreaming/domain/entity/upload"
	"videoStreaming/infrastructure/entity/upload"
	uploadRepo "videoStreaming/infrastructure/repository/upload"

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

	if migrateErr := db.AutoMigrate(&upload.Entity{}); migrateErr != nil {
		t.Fatalf("failed to auto migrate upload entity: %v", migrateErr)
	}

	_ = db.Exec("DELETE FROM uploads").Error
	t.Cleanup(func() {
		_ = db.Exec("DELETE FROM uploads").Error
	})

	return db
}

func TestUploadRepository_Upsert(t *testing.T) {
	db := setupTestDB(t)
	logger := slog.New(slog.DiscardHandler)
	repo := uploadRepo.NewRepository(db, logger)

	t.Run("insert and update", func(t *testing.T) {
		err := repo.Upsert(context.Background(), domainEntity.Upload{
			ID:       "",
			Filename: "test.mp4",
			Status:   "pending",
			TusID:    "tus-test-1",
		})
		if err != nil {
			t.Fatalf("expected no error on insert, got %v", err)
		}

		err = repo.Upsert(context.Background(), domainEntity.Upload{
			ID:       "",
			Filename: "test_updated.mp4",
			Status:   "completed",
			TusID:    "tus-test-1",
		})
		if err != nil {
			t.Fatalf("expected no error on update, got %v", err)
		}
	})

	t.Run("DB error cases", func(t *testing.T) {
		sqlDB, _ := db.DB()
		_ = sqlDB.Close()

		err := repo.Upsert(context.Background(), domainEntity.Upload{
			ID:       "",
			Filename: "test.mp4",
			Status:   "pending",
			TusID:    "tus-test-1",
		})
		if err == nil {
			t.Errorf("expected error on closed db, got nil")
		}
	})
}
