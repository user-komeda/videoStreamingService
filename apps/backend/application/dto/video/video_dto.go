package video

import (
	applicationDto "videoStreaming/application/dto"
	entity "videoStreaming/domain/entity/video"
	vo "videoStreaming/domain/valueObject/video"
)

type Dto struct {
	id          string
	ownerID     string
	title       string
	description string
	visibility  vo.Visibility
	status      vo.Status
	filePath    string
	fileSize    int64
	durationMs  int64
	mimeType    string
}

func FromDomain(v entity.Video) *Dto {
	mimeTypeStr := ""
	if v.MimeType() != nil {
		mimeTypeStr = v.MimeType().String()
	}

	return &Dto{
		id:          v.ID(),
		ownerID:     v.OwnerID(),
		title:       v.Title(),
		description: v.Description(),
		visibility:  v.Visibility(),
		status:      v.Status(),
		filePath:    v.FilePath(),
		fileSize:    v.FileSize(),
		durationMs:  v.DurationMs(),
		mimeType:    mimeTypeStr,
	}
}

func FromDomainList(videos []entity.Video) []*Dto {
	dtos := make([]*Dto, 0, len(videos))
	for _, v := range videos {
		dtos = append(dtos, FromDomain(v))
	}
	return dtos
}

func (d *Dto) ID() string                { return d.id }
func (d *Dto) OwnerID() string           { return d.ownerID }
func (d *Dto) Title() string             { return d.title }
func (d *Dto) Description() string       { return d.description }
func (d *Dto) Visibility() vo.Visibility { return d.visibility }
func (d *Dto) Status() vo.Status         { return d.status }
func (d *Dto) FilePath() string          { return d.filePath }
func (d *Dto) FileSize() int64           { return d.fileSize }
func (d *Dto) DurationMs() int64         { return d.durationMs }
func (d *Dto) MimeType() string          { return d.mimeType }

var _ applicationDto.FromDomainFunc[entity.Video, *Dto] = FromDomain
var _ applicationDto.FromDomainListFunc[entity.Video, *Dto] = FromDomainList
