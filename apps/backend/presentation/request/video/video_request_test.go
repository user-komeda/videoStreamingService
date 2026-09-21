package video_test

import (
	"testing"

	vo "videoStreaming/domain/valueObject/video"
	reqVideo "videoStreaming/presentation/request/video"
)

func TestVideoRequest_ToDto(t *testing.T) {
	// Create request
	createReq := reqVideo.CreateVideoRequest{
		Title:       "Test",
		Description: "Desc",
		Visibility:  vo.Public,
	}
	cDto, err := createReq.ToDto()
	if err != nil || cDto.Title() != "Test" {
		t.Fatalf("CreateVideoRequest.ToDto failed: %v", err)
	}

	// Create request invalid
	createReqInvalid := reqVideo.CreateVideoRequest{
		Visibility: "invalid",
	}
	_, err = createReqInvalid.ToDto()
	if err == nil {
		t.Fatalf("expected error for invalid visibility")
	}

	// Update request
	updateReq := reqVideo.UpdateVideoRequest{
		ID:          "v-1",
		Title:       "Updated",
		Description: "Updated Desc",
		Visibility:  vo.Private,
	}
	uDto, err := updateReq.ToDto()
	if err != nil || uDto.ID() != "v-1" || uDto.Title() != "Updated" {
		t.Fatalf("UpdateVideoRequest.ToDto failed: %v", err)
	}

	// Update request invalid
	updateReqInvalid := reqVideo.UpdateVideoRequest{
		ID:         "v-1",
		Visibility: "invalid",
	}
	_, err = updateReqInvalid.ToDto()
	if err == nil {
		t.Fatalf("expected error for invalid visibility")
	}
}
