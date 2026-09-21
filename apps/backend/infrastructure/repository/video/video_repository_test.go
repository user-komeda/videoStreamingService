package video_test

import (
	"cmp"
	"context"
	"log/slog"
	"testing"

	"videoStreaming/app"
	"videoStreaming/config"
	domainVideo "videoStreaming/domain/entity/video"
	infraEntity "videoStreaming/infrastructure/entity/video"
	videoRepo "videoStreaming/infrastructure/repository/video"

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
		t.Fatalf("failed to auto migrate video entity: %v", migrateErr)
	}

	return db
}

func buildTestVideo(t *testing.T, id, ownerID string) *domainVideo.Video {
	t.Helper()
	v, err := domainVideo.Build(domainVideo.Attrs{
		ID:          id,
		OwnerID:     ownerID,
		Title:       "Test Route",
		Description: "Test Description",
		Visibility:  "public",
		Status:      "ready",
		FilePath:    "",
		FileSize:    0,
		MimeType:    nil,
	})
	if err != nil {
		t.Fatalf("failed to build domain video: %v", err)
	}
	return v
}

func TestVideoRepository_CRUD(t *testing.T) {
	db := setupTestDB(t)
	logger := slog.New(slog.DiscardHandler)
	repo := videoRepo.NewRepository(db, logger)
	ctx := context.Background()

	testID := uuid.NewString()
	testOwnerID := uuid.NewString()
	v := buildTestVideo(t, testID, testOwnerID)

	// 1. Create
	created, err := repo.Create(ctx, *v)
	if err != nil {
		t.Fatalf("failed to create video: %v", err)
	}
	if created.ID() == "" {
		t.Errorf("expected generated ID")
	}

	// 2. GetByID
	found, err := repo.GetByID(ctx, created.ID())
	if err != nil {
		t.Fatalf("failed to get video by id: %v", err)
	}
	if found.Title() != "Test Route" {
		t.Errorf("expected title 'Test Route', got %s", found.Title())
	}

	// 3. GetAll
	all, err := repo.GetAll(ctx)
	if err != nil {
		t.Fatalf("failed to get all videos: %v", err)
	}
	if len(all) == 0 {
		t.Errorf("expected at least 1 video, got %d", len(all))
	}

	// 4. Update
	if updateErr := found.UpdateMetadata(
		domainVideo.UpdateMetadataParams{Title: "Updated Route", Description: "", Visibility: ""},
	); updateErr != nil {
		t.Fatalf("failed to update metadata: %v", updateErr)
	}
	updated, err := repo.Update(ctx, found)
	if err != nil {
		t.Fatalf("failed to update video: %v", err)
	}
	if updated.Title() != "Updated Route" {
		t.Errorf("expected updated title, got %s", updated.Title())
	}

	// 5. Delete
	if delErr := repo.Delete(ctx, created.ID()); delErr != nil {
		t.Fatalf("failed to delete video: %v", delErr)
	}

	// 6. GetByID not found
	_, notFoundErr := repo.GetByID(ctx, created.ID())
	if notFoundErr == nil {
		t.Fatalf("expected error when getting deleted video")
	}
}

func TestVideoRepository_ClosedDB(t *testing.T) {
	logger := slog.New(slog.DiscardHandler)
	ctx := context.Background()
	closedDB, _ := app.NewGormDB(config.DBConfig{DSN: config.DefaultConfig().DB.DSN})
	if sDB, err := closedDB.DB(); err == nil {
		_ = sDB.Close()
	}
	closedRepo := videoRepo.NewRepository(closedDB, logger)

	testVideo := buildTestVideo(t, "id", "owner")

	if _, err := closedRepo.GetAll(ctx); err == nil {
		t.Errorf("expected error on GetAll with closed db")
	}
	if _, err := closedRepo.GetByID(ctx, "any-id"); err == nil {
		t.Errorf("expected error on GetByID with closed db")
	}
	if _, err := closedRepo.Create(ctx, *testVideo); err == nil {
		t.Errorf("expected error on Create with closed db")
	}
	if _, err := closedRepo.Update(ctx, *testVideo); err == nil {
		t.Errorf("expected error on Update with closed db")
	}
	if err := closedRepo.Delete(ctx, "any-id"); err == nil {
		t.Errorf("expected error on Delete with closed db")
	}
}

func TestVideoRepository_DomainMappingError(t *testing.T) {
	db := setupTestDB(t)
	logger := slog.New(slog.DiscardHandler)
	repo := videoRepo.NewRepository(db, logger)
	ctx := context.Background()

	corruptID := uuid.NewString()
	testOwnerID := uuid.NewString()
	_ = db.Exec("ALTER TABLE videos DROP CONSTRAINT IF EXISTS chk_videos_visibility").Error
	insertErr := db.Exec(
		"INSERT INTO videos (id, owner_id, title, description, visibility, status, file_path, file_size, duration_ms, mime_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		corruptID,
		testOwnerID,
		"Corrupt",
		"Desc",
		"invalid_vis",
		"ready",
		"",
		0,
		0,
		"",
	).Error
	if insertErr != nil {
		t.Fatalf("failed to insert corrupt video: %v", insertErr)
	}

	defer func() {
		db.Exec("DELETE FROM videos WHERE id = ?", corruptID)
		db.Exec(
			"ALTER TABLE videos ADD CONSTRAINT chk_videos_visibility CHECK (visibility = ANY (ARRAY['public'::text, 'private'::text]))",
		)
	}()

	if _, err := repo.GetByID(ctx, corruptID); err == nil {
		t.Errorf("expected error on GetByID for corrupt record")
	}
	if _, err := repo.GetAll(ctx); err == nil {
		t.Errorf("expected error on GetAll for corrupt record")
	}
}
