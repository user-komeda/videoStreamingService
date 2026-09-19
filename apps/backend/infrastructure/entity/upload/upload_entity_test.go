package upload_test

import (
	"testing"

	infraUpload "videoStreaming/infrastructure/entity/upload"
)

func TestUploadEntity(t *testing.T) {
	entity := infraUpload.Entity{
		ID:       "up-1",
		Filename: "video.mp4",
		Status:   "completed",
		TusID:    "tus-1",
	}

	if entity.TableName() != "uploads" {
		t.Fatalf("expected table name 'uploads', got %s", entity.TableName())
	}
}
