package video_test

import (
	"context"
	"log/slog"
	"testing"

	applicationDto "videoStreaming/application/dto/video"
	usecaseVideo "videoStreaming/application/usecase/video"
	domainEntity "videoStreaming/domain/entity/video"
	vo "videoStreaming/domain/valueObject/video"
)

type dummyMockRepo struct {
	getByIDFn func(ctx context.Context, id string) (domainEntity.Video, error)
}

func (d *dummyMockRepo) GetAll(
	_ context.Context,
) ([]domainEntity.Video, error) {
	return nil, nil
}
func (d *dummyMockRepo) GetByID(ctx context.Context, id string) (domainEntity.Video, error) {
	if d.getByIDFn != nil {
		return d.getByIDFn(ctx, id)
	}
	return domainEntity.Video{}, nil
}

func (d *dummyMockRepo) Create(
	_ context.Context,
	v domainEntity.Video,
) (domainEntity.Video, error) {
	return v, nil
}

func (d *dummyMockRepo) Update(
	_ context.Context,
	v domainEntity.Video,
) (domainEntity.Video, error) {
	return v, nil
}
func (d *dummyMockRepo) Delete(_ context.Context, _ string) error { return nil }

func TestUpdateUseCase_InvalidMetadata(t *testing.T) {
	v, _ := domainEntity.Build(domainEntity.Attrs{
		ID:          "v-1",
		OwnerID:     "",
		Title:       "Title",
		Description: "",
		Visibility:  vo.Public,
		Status:      vo.StatusReady,
		FilePath:    "",
		FileSize:    0,
		MimeType:    nil,
	})
	repo := &dummyMockRepo{
		getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
			return *v, nil
		},
	}
	logger := slog.New(slog.DiscardHandler)
	uc := usecaseVideo.NewUpdateUseCase(repo, logger)

	// Bypass BuildUpdateVideoDto validation to trigger existing.UpdateMetadata failure
	dto := applicationDto.NewUpdateVideoDtoDirect("v-1", applicationDto.UpdateVideoAttrs{
		Title:       "",
		Description: "",
		Visibility:  vo.Visibility("invalid_visibility"),
	})

	err := uc.Invoke(t.Context(), dto)
	if err == nil {
		t.Fatalf("expected error on invalid metadata, got nil")
	}
}
