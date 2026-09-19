package video_test

import (
	"testing"

	dto "videoStreaming/application/dto/video"
	domainEntity "videoStreaming/domain/entity/video"
	vo "videoStreaming/domain/valueObject/video"
	"videoStreaming/presentation/response"
	respVideo "videoStreaming/presentation/response/video"

	"github.com/gabriel-vasile/mimetype"
)

func TestVideoResponse_FromDto_Nil(t *testing.T) {
	if respVideo.FromDto(nil) != nil {
		t.Fatalf("expected nil for nil dto")
	}
}

func TestVideoResponse_FromDto_WithMime(t *testing.T) {
	mime := mimetype.Lookup("video/mp4")
	domVideo, _ := domainEntity.Build(domainEntity.Attrs{
		ID:          "v-1",
		OwnerID:     "o-1",
		Title:       "Title 1",
		Description: "Desc 1",
		Visibility:  vo.Public,
		Status:      vo.StatusReady,
		FilePath:    "/path/1",
		FileSize:    1024,
		DurationMs:  45000,
		MimeType:    mime,
	})
	videoDto := dto.FromDomain(*domVideo)

	res := respVideo.FromDto(videoDto)
	if res.ID != "v-1" || res.OwnerID != "o-1" || res.Title != "Title 1" {
		t.Fatalf("FromDto mismatch: %+v", res)
	}
	if res.Description != "Desc 1" || res.Visibility != "public" || res.Status != "ready" {
		t.Fatalf("FromDto mismatch: %+v", res)
	}
	if res.FilePath != "/path/1" || res.FileSize != 1024 || res.DurationMs != 45000 || res.MimeType == nil ||
		*res.MimeType != "video/mp4" {
		t.Fatalf("FromDto mismatch: %+v", res)
	}
}

func TestVideoResponse_FromDto_NoMime(t *testing.T) {
	domVideoNoMime, _ := domainEntity.Build(domainEntity.Attrs{
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
	videoDtoNoMime := dto.FromDomain(*domVideoNoMime)
	resNoMime := respVideo.FromDto(videoDtoNoMime)
	if resNoMime.MimeType != nil {
		t.Fatalf("expected nil mimeType, got %v", resNoMime.MimeType)
	}

	domVideoKey, _ := domainEntity.Build(domainEntity.Attrs{
		ID:          "v-3",
		OwnerID:     "",
		Title:       "",
		Description: "",
		Visibility:  vo.Private,
		Status:      vo.StatusReady,
		FilePath:    "raw-upload-key-123",
		FileSize:    1024,
		MimeType:    nil,
	})
	videoDtoKey := dto.FromDomain(*domVideoKey)
	resKey := respVideo.FromDto(videoDtoKey)
	if resKey.FilePath != "/videos/v-3/stream" {
		t.Fatalf("expected /videos/v-3/stream, got %s", resKey.FilePath)
	}
}

func TestVideoResponse_FromDtoList(t *testing.T) {
	domVideo, _ := domainEntity.Build(domainEntity.Attrs{
		ID:          "v-1",
		OwnerID:     "o-1",
		Title:       "Title 1",
		Description: "Desc 1",
		Visibility:  vo.Public,
		Status:      vo.StatusReady,
		FilePath:    "/path/1",
		FileSize:    1024,
		MimeType:    nil,
	})
	videoDto := dto.FromDomain(*domVideo)

	list := respVideo.FromDtoList([]*dto.Dto{videoDto, nil})
	if len(list) != 1 {
		t.Fatalf("expected 1 item, got %d", len(list))
	}
}

func TestVideoResponse_FromDtoPagination(t *testing.T) {
	domVideo, _ := domainEntity.Build(domainEntity.Attrs{
		ID:          "v-1",
		OwnerID:     "o-1",
		Title:       "Title 1",
		Description: "Desc 1",
		Visibility:  vo.Public,
		Status:      vo.StatusReady,
		FilePath:    "/path/1",
		FileSize:    1024,
		MimeType:    nil,
	})
	videoDto := dto.FromDomain(*domVideo)

	param := response.NewPaginationParam(100, 1, 10)
	pageRes := respVideo.FromDtoPagination([]*dto.Dto{videoDto}, param)
	if len(pageRes.Videos) != 1 || pageRes.Pagination.Total != 100 ||
		pageRes.Pagination.TotalPages != 10 ||
		!pageRes.Pagination.HasNext {
		t.Fatalf("FromDtoPagination mismatch: %+v", pageRes)
	}
}

func TestPaginationMeta(t *testing.T) {
	paramZero := response.NewPaginationParam(50, 1, 0)
	metaZero := response.NewPaginationMeta(paramZero)
	if metaZero.TotalPages != 0 || metaZero.HasNext {
		t.Fatalf("expected 0 totalPages and false hasNext for perPage=0")
	}

	paramLast := response.NewPaginationParam(25, 3, 10)
	metaLast := response.NewPaginationMeta(paramLast)
	if metaLast.TotalPages != 3 || metaLast.HasNext {
		t.Fatalf("expected totalPages=3 and hasNext=false on last page")
	}
}
