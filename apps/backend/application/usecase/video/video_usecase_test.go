package video_test

import (
	"context"
	"errors"
	"log/slog"
	"testing"

	applicationDto "videoStreaming/application/dto/video"
	appErrors "videoStreaming/application/errors"
	usecaseVideo "videoStreaming/application/usecase/video"
	domainEntity "videoStreaming/domain/entity/video"
	domainErrors "videoStreaming/domain/errors"
	domainRepo "videoStreaming/domain/repository/video"
	vo "videoStreaming/domain/valueObject/video"
)

type mockVideoRepo struct {
	getAllFn  func(ctx context.Context) ([]domainEntity.Video, error)
	getByIDFn func(ctx context.Context, id string) (domainEntity.Video, error)
	createFn  func(ctx context.Context, v domainEntity.Video) (domainEntity.Video, error)
	updateFn  func(ctx context.Context, v domainEntity.Video) (domainEntity.Video, error)
	deleteFn  func(ctx context.Context, id string) error
}

func (m *mockVideoRepo) GetAll(ctx context.Context) ([]domainEntity.Video, error) {
	if m.getAllFn != nil {
		return m.getAllFn(ctx)
	}
	return nil, nil
}

func (m *mockVideoRepo) GetByID(ctx context.Context, id string) (domainEntity.Video, error) {
	if m.getByIDFn != nil {
		return m.getByIDFn(ctx, id)
	}
	return domainEntity.Video{}, nil
}

func (m *mockVideoRepo) Create(
	ctx context.Context,
	v domainEntity.Video,
) (domainEntity.Video, error) {
	if m.createFn != nil {
		return m.createFn(ctx, v)
	}
	return v, nil
}

func (m *mockVideoRepo) Update(
	ctx context.Context,
	v domainEntity.Video,
) (domainEntity.Video, error) {
	if m.updateFn != nil {
		return m.updateFn(ctx, v)
	}
	return v, nil
}

func (m *mockVideoRepo) Delete(ctx context.Context, id string) error {
	if m.deleteFn != nil {
		return m.deleteFn(ctx, id)
	}
	return nil
}

var _ domainRepo.Repository = (*mockVideoRepo)(nil)

func newTestLogger() *slog.Logger {
	return slog.New(slog.DiscardHandler)
}

func TestGetDetailUseCase_ReturnsAppError(t *testing.T) {
	repo := &mockVideoRepo{
		getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
			return domainEntity.Video{}, domainErrors.ErrNotFound
		},
	}
	uc := usecaseVideo.NewGetDetailUseCase(repo, newTestLogger())

	_, err := uc.Invoke(t.Context(), "non-existing-id")
	if err == nil {
		t.Fatalf("expected error, got nil")
	}

	appErr, ok := errors.AsType[*appErrors.AppError](err)
	if !ok {
		t.Fatalf("expected *appErrors.AppError, got %T", err)
	}

	if appErr.Code != appErrors.CodeNotFound {
		t.Errorf("expected CodeNotFound, got %s", appErr.Code)
	}
}

func TestGetDetailUseCase_Success(t *testing.T) {
	v, _ := domainEntity.Build(domainEntity.Attrs{
		ID:          "v-1",
		OwnerID:     "",
		Title:       "Route 1",
		Description: "",
		Visibility:  vo.Public,
		Status:      vo.StatusReady,
		FilePath:    "",
		FileSize:    0,
		MimeType:    nil,
	})
	repo := &mockVideoRepo{
		getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
			return *v, nil
		},
	}
	uc := usecaseVideo.NewGetDetailUseCase(repo, newTestLogger())
	res, err := uc.Invoke(t.Context(), "v-1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if res.ID() != "v-1" || res.Title() != "Route 1" {
		t.Fatalf("unexpected result: %+v", res)
	}
}

func TestGetAllUseCase(t *testing.T) {
	v, _ := domainEntity.Build(domainEntity.Attrs{
		ID:          "v-1",
		OwnerID:     "",
		Title:       "Route 1",
		Description: "",
		Visibility:  vo.Public,
		Status:      vo.StatusReady,
		FilePath:    "",
		FileSize:    0,
		MimeType:    nil,
	})

	t.Run("success", func(t *testing.T) {
		repo := &mockVideoRepo{
			getAllFn: func(_ context.Context) ([]domainEntity.Video, error) {
				return []domainEntity.Video{*v}, nil
			},
		}
		uc := usecaseVideo.NewGetAllUseCase(repo, newTestLogger())
		list, err := uc.Invoke(t.Context())
		if err != nil || len(list) != 1 {
			t.Fatalf("expected 1 item, got %v, err: %v", list, err)
		}
	})

	t.Run("error", func(t *testing.T) {
		repo := &mockVideoRepo{
			getAllFn: func(_ context.Context) ([]domainEntity.Video, error) {
				return nil, domainErrors.ErrInternal
			},
		}
		uc := usecaseVideo.NewGetAllUseCase(repo, newTestLogger())
		_, err := uc.Invoke(t.Context())
		if err == nil {
			t.Fatalf("expected error, got nil")
		}
	})
}

func TestUpdateUseCase(t *testing.T) {
	v, _ := domainEntity.Build(domainEntity.Attrs{
		ID:          "test-id",
		OwnerID:     "",
		Title:       "Old Title",
		Description: "",
		Visibility:  vo.Public,
		Status:      vo.StatusReady,
		FilePath:    "",
		FileSize:    0,
		MimeType:    nil,
	})

	t.Run("success", func(t *testing.T) {
		repo := &mockVideoRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return *v, nil
			},
			updateFn: func(_ context.Context, v domainEntity.Video) (domainEntity.Video, error) {
				return v, nil
			},
		}
		uc := usecaseVideo.NewUpdateUseCase(repo, newTestLogger())
		dto, _ := applicationDto.BuildUpdateVideoDto("test-id", applicationDto.UpdateVideoAttrs{
			Title:       "New Title",
			Description: "",
			Visibility:  "",
		})
		err := uc.Invoke(t.Context(), dto)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
	})

	t.Run("update repo error", func(t *testing.T) {
		repo := &mockVideoRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return *v, nil
			},
			updateFn: func(_ context.Context, _ domainEntity.Video) (domainEntity.Video, error) {
				return domainEntity.Video{}, domainErrors.ErrInternal
			},
		}
		uc := usecaseVideo.NewUpdateUseCase(repo, newTestLogger())
		dto, _ := applicationDto.BuildUpdateVideoDto("test-id", applicationDto.UpdateVideoAttrs{
			Title:       "New Title",
			Description: "",
			Visibility:  "",
		})
		err := uc.Invoke(t.Context(), dto)
		if err == nil {
			t.Fatalf("expected error, got nil")
		}
	})
}

func TestDeleteUseCase(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		repo := &mockVideoRepo{
			deleteFn: func(_ context.Context, _ string) error {
				return nil
			},
		}
		uc := usecaseVideo.NewDeleteUseCase(repo, newTestLogger())
		err := uc.Invoke(t.Context(), "v-1")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
	})

	t.Run("error", func(t *testing.T) {
		repo := &mockVideoRepo{
			deleteFn: func(_ context.Context, _ string) error {
				return domainErrors.ErrNotFound
			},
		}
		uc := usecaseVideo.NewDeleteUseCase(repo, newTestLogger())
		err := uc.Invoke(t.Context(), "v-1")
		if err == nil {
			t.Fatalf("expected error, got nil")
		}
	})
}

func TestUpdateUseCase_NotFound_ReturnsAppError(t *testing.T) {
	repo := &mockVideoRepo{
		getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
			return domainEntity.Video{}, domainErrors.ErrNotFound
		},
	}
	uc := usecaseVideo.NewUpdateUseCase(repo, newTestLogger())

	dto, err := applicationDto.BuildUpdateVideoDto("test-id", applicationDto.UpdateVideoAttrs{
		Title:       "New Title",
		Description: "",
		Visibility:  "",
	})
	if err != nil {
		t.Fatalf("failed to build update dto: %v", err)
	}

	err = uc.Invoke(t.Context(), dto)
	if err == nil {
		t.Fatalf("expected error, got nil")
	}

	appErr, ok := errors.AsType[*appErrors.AppError](err)
	if !ok {
		t.Fatalf("expected *appErrors.AppError, got %T", err)
	}

	if appErr.Code != appErrors.CodeNotFound {
		t.Errorf("expected CodeNotFound, got %s", appErr.Code)
	}
}

func TestCreateUseCase(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		repo := &mockVideoRepo{
			createFn: func(_ context.Context, v domainEntity.Video) (domainEntity.Video, error) {
				return v, nil
			},
		}
		uc := usecaseVideo.NewCreateUseCase(repo, newTestLogger())
		dto, _ := applicationDto.BuildCreateVideoDto(applicationDto.CreateVideoAttrs{
			Title:       "Title",
			Description: "",
			Visibility:  vo.Public,
		})
		res, err := uc.Invoke(t.Context(), dto)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if res.Title() != "Title" {
			t.Fatalf("unexpected title: %s", res.Title())
		}
	})

	t.Run("invalid visibility on update metadata returns app error", func(t *testing.T) {
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

		failRepo := &mockVideoRepo{
			getByIDFn: func(_ context.Context, _ string) (domainEntity.Video, error) {
				return *v, nil
			},
			updateFn: func(_ context.Context, _ domainEntity.Video) (domainEntity.Video, error) {
				return domainEntity.Video{}, domainErrors.ErrInternal
			},
		}
		failUc := usecaseVideo.NewUpdateUseCase(failRepo, newTestLogger())
		validDto, _ := applicationDto.BuildUpdateVideoDto(
			"v-1",
			applicationDto.UpdateVideoAttrs{Title: "T", Description: "", Visibility: ""},
		)
		err := failUc.Invoke(t.Context(), validDto)
		if err == nil {
			t.Fatalf("expected error from failUc, got nil")
		}
	})

	t.Run("invalid dto convert returns app error", func(t *testing.T) {
		repo := &mockVideoRepo{}
		uc := usecaseVideo.NewCreateUseCase(repo, newTestLogger())
		dto := &applicationDto.CreateVideoDto{}
		_, err := uc.Invoke(t.Context(), dto)
		if err == nil {
			t.Fatalf("expected error, got nil")
		}
	})

	t.Run("duplicate returns app error", func(t *testing.T) {
		repo := &mockVideoRepo{
			createFn: func(_ context.Context, _ domainEntity.Video) (domainEntity.Video, error) {
				return domainEntity.Video{}, domainErrors.ErrAlreadyExists
			},
		}
		uc := usecaseVideo.NewCreateUseCase(repo, newTestLogger())

		dto, err := applicationDto.BuildCreateVideoDto(applicationDto.CreateVideoAttrs{
			Title:       "Route Title",
			Description: "",
			Visibility:  vo.Public,
		})
		if err != nil {
			t.Fatalf("failed to build create dto: %v", err)
		}

		_, err = uc.Invoke(t.Context(), dto)
		if err == nil {
			t.Fatalf("expected error, got nil")
		}

		appErr, ok := errors.AsType[*appErrors.AppError](err)
		if !ok {
			t.Fatalf("expected *appErrors.AppError, got %T", err)
		}

		if appErr.Code != appErrors.CodeConflict {
			t.Errorf("expected CodeConflict, got %s", appErr.Code)
		}
	})
}
