package video_test

import (
	"testing"

	domain "videoStreaming/domain/entity/video"
	vo "videoStreaming/domain/valueObject/video"
	infraVideo "videoStreaming/infrastructure/entity/video"

	"github.com/gabriel-vasile/mimetype"
)

func TestVideoEntity_BuildFromDomain(t *testing.T) {
	mime := mimetype.Lookup("video/mp4")
	domVideo, err := domain.Build(domain.Attrs{
		ID:          "v-1",
		OwnerID:     "o-1",
		Title:       "Title",
		Description: "Desc",
		Visibility:  vo.Public,
		Status:      vo.StatusReady,
		FilePath:    "/path/video.mp4",
		FileSize:    5000,
		DurationMs:  60000,
		MimeType:    mime,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	entity, err := infraVideo.BuildFromDomainEntity(domVideo)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if entity.ID != "v-1" || entity.OwnerID != "o-1" || entity.Title != "Title" {
		t.Fatalf("entity fields mismatch: %+v", entity)
	}
	if entity.Description != "Desc" || entity.Visibility != "public" || entity.Status != "ready" {
		t.Fatalf("entity fields mismatch: %+v", entity)
	}
	if entity.FilePath != "/path/video.mp4" || entity.FileSize != 5000 || entity.DurationMs != 60000 ||
		entity.MimeType != "video/mp4" {
		t.Fatalf("entity fields mismatch: %+v", entity)
	}
	if entity.TableName() != "videos" {
		t.Fatalf("expected table name 'videos', got %s", entity.TableName())
	}
}

func TestVideoEntity_ToDomain_Success(t *testing.T) {
	entity := &infraVideo.Entity{
		ID:          "v-1",
		OwnerID:     "o-1",
		Title:       "Title",
		Description: "Desc",
		Visibility:  "public",
		Status:      "ready",
		FilePath:    "/path/video.mp4",
		FileSize:    5000,
		DurationMs:  60000,
		MimeType:    "video/mp4",
	}

	converted, err := entity.ToDomain()
	if err != nil {
		t.Fatalf("ToDomain failed: %v", err)
	}
	if converted.ID() != "v-1" || converted.Visibility() != vo.Public ||
		converted.Status() != vo.StatusReady || converted.DurationMs() != 60000 {
		t.Fatalf("converted domain mismatch: %+v", converted)
	}
}

func TestVideoEntity_NilMime(t *testing.T) {
	domVideoNoMime, _ := domain.Build(domain.Attrs{
		ID:          "v-2",
		OwnerID:     "",
		Title:       "",
		Description: "",
		Visibility:  vo.Private,
		Status:      vo.StatusNotReady,
		FilePath:    "",
		FileSize:    0,
		MimeType:    nil,
	})
	entityNoMime, _ := infraVideo.BuildFromDomainEntity(domVideoNoMime)
	if entityNoMime.MimeType != "" {
		t.Fatalf("expected empty mime type, got %s", entityNoMime.MimeType)
	}
}

func TestVideoEntity_InvalidVisibility(t *testing.T) {
	entityInvalidVis := &infraVideo.Entity{
		ID:          "",
		OwnerID:     "",
		Title:       "",
		Description: "",
		Visibility:  "invalid",
		Status:      "ready",
		FilePath:    "",
		FileSize:    0,
		MimeType:    "",
	}
	_, err := entityInvalidVis.ToDomain()
	if err == nil {
		t.Fatalf("expected error for invalid visibility")
	}
}

func TestVideoEntity_InvalidStatus(t *testing.T) {
	entityInvalidStatus := &infraVideo.Entity{
		ID:          "",
		OwnerID:     "",
		Title:       "",
		Description: "",
		Visibility:  "public",
		Status:      "invalid",
		FilePath:    "",
		FileSize:    0,
		MimeType:    "",
	}
	_, err := entityInvalidStatus.ToDomain()
	if err == nil {
		t.Fatalf("expected error for invalid status")
	}
}
