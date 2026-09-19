package video

import (
	applicationDto "videoStreaming/application/dto"
	entity "videoStreaming/domain/entity/video"
	domainErrors "videoStreaming/domain/errors"
	vo "videoStreaming/domain/valueObject/video"
)

type UpdateVideoAttrs struct {
	Title       string
	Description string
	Visibility  vo.Visibility
}

type UpdateVideoDto struct {
	id    string
	attrs UpdateVideoAttrs
}

func BuildUpdateVideoDto(id string, attrs UpdateVideoAttrs) (*UpdateVideoDto, error) {
	if attrs.Visibility != "" && !attrs.Visibility.IsValid() {
		return nil, domainErrors.ErrInvalidVisibility
	}

	return &UpdateVideoDto{
		id:    id,
		attrs: attrs,
	}, nil
}

func NewUpdateVideoDtoDirect(id string, attrs UpdateVideoAttrs) *UpdateVideoDto {
	return &UpdateVideoDto{
		id:    id,
		attrs: attrs,
	}
}

func (u UpdateVideoDto) ID() string                { return u.id }
func (u UpdateVideoDto) Title() string             { return u.attrs.Title }
func (u UpdateVideoDto) Description() string       { return u.attrs.Description }
func (u UpdateVideoDto) Visibility() vo.Visibility { return u.attrs.Visibility }

func (u UpdateVideoDto) ToUpdateParams() entity.UpdateMetadataParams {
	return entity.UpdateMetadataParams{
		Title:       u.attrs.Title,
		Description: u.attrs.Description,
		Visibility:  u.attrs.Visibility,
	}
}

var _ applicationDto.BuilderWithIDFunc[UpdateVideoAttrs, *UpdateVideoDto] = BuildUpdateVideoDto
var _ applicationDto.UpdateParamsConverter[entity.UpdateMetadataParams] = (*UpdateVideoDto)(nil)
