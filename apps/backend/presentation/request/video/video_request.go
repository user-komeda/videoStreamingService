package video

import (
	applicationDto "videoStreaming/application/dto/video"
	vo "videoStreaming/domain/valueObject/video"
	"videoStreaming/presentation/request"
)

// CreateVideoRequest 動画作成リクエスト.
type CreateVideoRequest struct {
	Title       string        `json:"title"       binding:"required,min=1,max=100"`
	Description string        `json:"description" binding:"max=1000"`
	Visibility  vo.Visibility `json:"visibility"  binding:"required"`
}

// ToDto DTOへの変換.
func (r *CreateVideoRequest) ToDto() (*applicationDto.CreateVideoDto, error) {
	return applicationDto.BuildCreateVideoDto(applicationDto.CreateVideoAttrs{
		Title:       r.Title,
		Description: r.Description,
		Visibility:  r.Visibility,
	})
}

// UpdateVideoRequest 動画更新リクエスト.
type UpdateVideoRequest struct {
	ID          string        `json:"-"` // パスパラメータから設定
	Title       string        `json:"title"       binding:"omitempty,min=1,max=100"`
	Description string        `json:"description" binding:"max=1000"`
	Visibility  vo.Visibility `json:"visibility"  binding:"omitempty"`
}

// ToDto DTOへの変換.
func (r *UpdateVideoRequest) ToDto() (*applicationDto.UpdateVideoDto, error) {
	return applicationDto.BuildUpdateVideoDto(r.ID, applicationDto.UpdateVideoAttrs{
		Title:       r.Title,
		Description: r.Description,
		Visibility:  r.Visibility,
	})
}

var _ request.DtoConverter[*applicationDto.CreateVideoDto] = (*CreateVideoRequest)(nil)
var _ request.DtoConverter[*applicationDto.UpdateVideoDto] = (*UpdateVideoRequest)(nil)
