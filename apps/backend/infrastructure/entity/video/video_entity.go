package video

import (
	"fmt"

	domain "videoStreaming/domain/entity/video"
	vo "videoStreaming/domain/valueObject/video"
	infraEntity "videoStreaming/infrastructure/entity"

	"github.com/gabriel-vasile/mimetype"
)

type Entity struct {
	ID          string `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	OwnerID     string `gorm:"type:uuid;default:gen_random_uuid()"`
	Title       string
	Description string
	Visibility  string
	Status      string
	FilePath    string
	FileSize    int64
	DurationMs  int64
	MimeType    string
}

func BuildFromDomainEntity(video *domain.Video) (*Entity, error) {
	mimeTypeStr := ""
	if video.MimeType() != nil {
		mimeTypeStr = video.MimeType().String()
	}

	return &Entity{
		ID:          video.ID(),
		OwnerID:     video.OwnerID(),
		Title:       video.Title(),
		Description: video.Description(),
		Visibility:  video.Visibility().String(),
		Status:      video.Status().String(),
		FilePath:    video.FilePath(),
		FileSize:    video.FileSize(),
		DurationMs:  video.DurationMs(),
		MimeType:    mimeTypeStr,
	}, nil
}

func (v *Entity) ToDomain() (*domain.Video, error) {
	visibility, err := vo.NewVisibility(v.Visibility)
	if err != nil {
		return nil, fmt.Errorf("failed to parse visibility: %w", err)
	}

	status, err := vo.NewStatus(v.Status)
	if err != nil {
		return nil, fmt.Errorf("failed to parse status: %w", err)
	}

	attrs := domain.Attrs{
		ID:          v.ID,
		OwnerID:     v.OwnerID,
		Title:       v.Title,
		Description: v.Description,
		Visibility:  visibility,
		Status:      status,
		FilePath:    v.FilePath,
		FileSize:    v.FileSize,
		DurationMs:  v.DurationMs,
		MimeType:    mimetype.Lookup(v.MimeType),
	}

	return domain.Build(attrs)
}

func (*Entity) TableName() string {
	return "videos"
}

var _ infraEntity.DomainConverter[*domain.Video] = (*Entity)(nil)
var _ infraEntity.InfraEntityBuilderFunc[*domain.Video, *Entity] = BuildFromDomainEntity
