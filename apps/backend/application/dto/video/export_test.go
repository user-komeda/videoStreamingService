package video_test

import (
	"testing"

	dto "videoStreaming/application/dto/video"
	vo "videoStreaming/domain/valueObject/video"
)

func TestNewUpdateVideoDtoDirect(t *testing.T) {
	d := dto.NewUpdateVideoDtoDirect("v-1", dto.UpdateVideoAttrs{
		Title:       "",
		Description: "",
		Visibility:  vo.Public,
	})
	if d.ID() != "v-1" || d.Visibility() != vo.Public {
		t.Errorf("unexpected dto: %+v", d)
	}
}
