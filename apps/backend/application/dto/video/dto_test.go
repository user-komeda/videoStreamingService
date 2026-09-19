package video_test

import (
	"errors"
	"testing"

	dto "videoStreaming/application/dto/video"
	domainEntity "videoStreaming/domain/entity/video"
	domainErrors "videoStreaming/domain/errors"
	vo "videoStreaming/domain/valueObject/video"

	"github.com/gabriel-vasile/mimetype"
)

func TestCreateVideoDto_Invalid(t *testing.T) {
	_, err := dto.BuildCreateVideoDto(dto.CreateVideoAttrs{
		Title:       "",
		Description: "",
		Visibility:  "invalid",
	})
	if !errors.Is(err, domainErrors.ErrInvalidVisibility) {
		t.Fatalf("expected ErrInvalidVisibility, got %v", err)
	}
}

func TestCreateVideoDto_Success(t *testing.T) {
	cDto, err := dto.BuildCreateVideoDto(dto.CreateVideoAttrs{
		Title:       "Test",
		Description: "Desc",
		Visibility:  vo.Public,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if cDto.Title() != "Test" || cDto.Description() != "Desc" || cDto.Visibility() != vo.Public {
		t.Fatalf("dto getters returned mismatch")
	}

	entity, err := cDto.ConvertToDomainEntity()
	if err != nil {
		t.Fatalf("failed to convert to domain entity: %v", err)
	}
	if entity.Title() != "Test" || entity.Description() != "Desc" ||
		entity.Visibility() != vo.Public ||
		entity.Status() != vo.StatusNotReady {
		t.Fatalf("entity fields mismatch")
	}
}

func TestUpdateVideoDto_Invalid(t *testing.T) {
	_, err := dto.BuildUpdateVideoDto("v1", dto.UpdateVideoAttrs{
		Title:       "",
		Description: "",
		Visibility:  "invalid",
	})
	if !errors.Is(err, domainErrors.ErrInvalidVisibility) {
		t.Fatalf("expected ErrInvalidVisibility, got %v", err)
	}
}

func TestUpdateVideoDto_ValidWithVisibility(t *testing.T) {
	uDto, err := dto.BuildUpdateVideoDto("v1", dto.UpdateVideoAttrs{
		Title:       "Title",
		Description: "Desc",
		Visibility:  vo.Private,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if uDto.ID() != "v1" || uDto.Title() != "Title" || uDto.Description() != "Desc" ||
		uDto.Visibility() != vo.Private {
		t.Fatalf("dto getters mismatch")
	}

	params := uDto.ToUpdateParams()
	if params.Title != "Title" || params.Description != "Desc" || params.Visibility != vo.Private {
		t.Fatalf("update params mismatch")
	}
}

func TestUpdateVideoDto_ValidWithoutVisibility(t *testing.T) {
	uDto, err := dto.BuildUpdateVideoDto("v2", dto.UpdateVideoAttrs{
		Title:       "Title2",
		Description: "",
		Visibility:  "",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if uDto.ID() != "v2" || uDto.Visibility() != "" {
		t.Fatalf("empty visibility handling failed")
	}
}

func createTestDomainVideos(t *testing.T) (*domainEntity.Video, *domainEntity.Video) {
	t.Helper()
	mime := mimetype.Lookup("video/mp4")
	v1, err := domainEntity.Build(domainEntity.Attrs{
		ID:          "v1",
		OwnerID:     "o1",
		Title:       "Title 1",
		Description: "Desc 1",
		Visibility:  vo.Public,
		Status:      vo.StatusReady,
		FilePath:    "/path/1",
		FileSize:    100,
		DurationMs:  12000,
		MimeType:    mime,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	v2, err := domainEntity.Build(domainEntity.Attrs{
		ID:          "v2",
		OwnerID:     "o2",
		Title:       "Title 2",
		Description: "Desc 2",
		Visibility:  vo.Private,
		Status:      vo.StatusNotReady,
		FilePath:    "",
		FileSize:    0,
		MimeType:    nil,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	return v1, v2
}

func TestVideoDto_FromDomain(t *testing.T) {
	v1, v2 := createTestDomainVideos(t)

	d1 := dto.FromDomain(*v1)
	if d1.ID() != "v1" || d1.OwnerID() != "o1" || d1.Title() != "Title 1" {
		t.Fatalf("dto getters mismatch for v1")
	}
	if d1.Description() != "Desc 1" || d1.Visibility() != vo.Public || d1.Status() != vo.StatusReady {
		t.Fatalf("dto getters mismatch for v1")
	}
	if d1.FilePath() != "/path/1" || d1.FileSize() != 100 || d1.DurationMs() != 12000 || d1.MimeType() != "video/mp4" {
		t.Fatalf("dto getters mismatch for v1")
	}

	d2 := dto.FromDomain(*v2)
	if d2.MimeType() != "" {
		t.Fatalf("expected empty mime type, got %s", d2.MimeType())
	}
}

func TestVideoDto_FromDomainList(t *testing.T) {
	v1, v2 := createTestDomainVideos(t)

	list := dto.FromDomainList([]domainEntity.Video{*v1, *v2})
	if len(list) != 2 || list[0].ID() != "v1" || list[1].ID() != "v2" {
		t.Fatalf("FromDomainList failed")
	}
}
