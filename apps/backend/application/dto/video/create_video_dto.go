package video

import (
	applicationDto "videoStreaming/application/dto"
	entity "videoStreaming/domain/entity/video"
	domainErrors "videoStreaming/domain/errors"
	vo "videoStreaming/domain/valueObject/video"
)

type CreateVideoAttrs struct {
	Title       string
	Description string
	Visibility  vo.Visibility
}

type CreateVideoDto struct {
	attrs CreateVideoAttrs
}

func BuildCreateVideoDto(attrs CreateVideoAttrs) (*CreateVideoDto, error) {
	if !attrs.Visibility.IsValid() {
		return nil, domainErrors.ErrInvalidVisibility
	}

	return &CreateVideoDto{
		attrs: attrs,
	}, nil
}

func (c CreateVideoDto) Title() string             { return c.attrs.Title }
func (c CreateVideoDto) Description() string       { return c.attrs.Description }
func (c CreateVideoDto) Visibility() vo.Visibility { return c.attrs.Visibility }

func (c CreateVideoDto) ConvertToDomainEntity() (*entity.Video, error) {
	return entity.Build(entity.Attrs{
		ID:          "",
		OwnerID:     "",
		Title:       c.Title(),
		Description: c.Description(),
		Visibility:  c.Visibility(),
		Status:      vo.StatusNotReady,
		FilePath:    "",
		FileSize:    0,
		MimeType:    nil,
	})
}

var _ applicationDto.BuilderFunc[CreateVideoAttrs, *CreateVideoDto] = BuildCreateVideoDto
var _ applicationDto.EntityConverter[*entity.Video] = (*CreateVideoDto)(nil)
