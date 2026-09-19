package video_test

import (
	"errors"
	"testing"

	"videoStreaming/domain/entity/video"
	domainErrors "videoStreaming/domain/errors"
	vo "videoStreaming/domain/valueObject/video"

	"github.com/gabriel-vasile/mimetype"
)

func TestVideo_Build_Success(t *testing.T) {
	mime := mimetype.Lookup("video/mp4")
	attrs := video.Attrs{
		ID:          "v1",
		OwnerID:     "o1",
		Title:       "Test Route",
		Description: "Test Description",
		Visibility:  vo.Public,
		Status:      vo.StatusReady,
		FilePath:    "/path/to/video.mp4",
		FileSize:    1024,
		MimeType:    mime,
	}

	v, err := video.Build(attrs)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if v.ID() != "v1" || v.OwnerID() != "o1" || v.Title() != "Test Route" ||
		v.Description() != "Test Description" || v.Visibility() != vo.Public ||
		v.Status() != vo.StatusReady || v.FilePath() != "/path/to/video.mp4" ||
		v.FileSize() != 1024 || v.DurationMs() != 0 || v.MimeType() != mime {
		t.Fatalf("getters returned mismatching values")
	}
}

func TestVideo_MarkReady(t *testing.T) {
	v, err := video.Build(video.Attrs{
		ID:         "v1",
		Visibility: vo.Public,
		Status:     vo.StatusNotReady,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	mime := mimetype.Lookup("video/mp4")
	v.MarkReady("new-file-path.mp4", 2048, mime, 45000)

	if v.FilePath() != "new-file-path.mp4" || v.FileSize() != 2048 ||
		v.MimeType() != mime || v.DurationMs() != 45000 || v.Status() != vo.StatusReady {
		t.Fatalf("MarkReady failed to set ready values")
	}

	// Calling MarkReady with <=0 and nil values preserves existing size/mime/duration
	v.MarkReady("another-path.mp4", 0, nil, 0)
	if v.FilePath() != "another-path.mp4" || v.FileSize() != 2048 ||
		v.MimeType() != mime || v.DurationMs() != 45000 || v.Status() != vo.StatusReady {
		t.Fatalf("MarkReady overwrite check failed")
	}
}

func TestVideo_Build_InvalidVisibility(t *testing.T) {
	attrs := video.Attrs{
		Visibility: "invalid",
		Status:     vo.StatusReady,
	}
	_, err := video.Build(attrs)
	if !errors.Is(err, domainErrors.ErrInvalidVisibility) {
		t.Fatalf("expected ErrInvalidVisibility, got %v", err)
	}
}

func TestVideo_Build_InvalidStatus(t *testing.T) {
	attrs := video.Attrs{
		Visibility: vo.Public,
		Status:     "invalid",
	}
	_, err := video.Build(attrs)
	if !errors.Is(err, domainErrors.ErrInvalidStatus) {
		t.Fatalf("expected ErrInvalidStatus, got %v", err)
	}
}

func TestVideo_UpdateMetadata(t *testing.T) {
	v, err := video.Build(video.Attrs{
		ID:         "v1",
		Visibility: vo.Public,
		Status:     vo.StatusReady,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	// Invalid visibility
	err = v.UpdateMetadata(video.UpdateMetadataParams{
		Visibility: "invalid",
	})
	if !errors.Is(err, domainErrors.ErrInvalidVisibility) {
		t.Fatalf("expected ErrInvalidVisibility, got %v", err)
	}

	// Valid update with visibility
	err = v.UpdateMetadata(video.UpdateMetadataParams{
		Title:       "New Title",
		Description: "New Desc",
		Visibility:  vo.Private,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if v.Title() != "New Title" || v.Description() != "New Desc" || v.Visibility() != vo.Private {
		t.Fatalf("update with visibility failed")
	}

	// Valid update without changing visibility
	err = v.UpdateMetadata(video.UpdateMetadataParams{
		Title:       "New Title 2",
		Description: "New Desc 2",
		Visibility:  "",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if v.Title() != "New Title 2" || v.Description() != "New Desc 2" ||
		v.Visibility() != vo.Private {
		t.Fatalf("update without visibility failed")
	}
}
