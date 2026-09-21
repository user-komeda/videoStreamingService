package video

import (
	entityBase "videoStreaming/domain/entity"
	domainErrors "videoStreaming/domain/errors"
	vo "videoStreaming/domain/valueObject/video"

	"github.com/gabriel-vasile/mimetype"
)

type Video struct {
	id          string
	ownerID     string
	title       string
	description string
	visibility  vo.Visibility
	status      vo.Status
	filePath    string
	fileSize    int64
	durationMs  int64
	mimeType    *mimetype.MIME
}

func (v *Video) ID() string                { return v.id }
func (v *Video) OwnerID() string           { return v.ownerID }
func (v *Video) Title() string             { return v.title }
func (v *Video) Description() string       { return v.description }
func (v *Video) Visibility() vo.Visibility { return v.visibility }
func (v *Video) Status() vo.Status         { return v.status }
func (v *Video) FilePath() string          { return v.filePath }
func (v *Video) FileSize() int64           { return v.fileSize }
func (v *Video) DurationMs() int64         { return v.durationMs }
func (v *Video) MimeType() *mimetype.MIME  { return v.mimeType }

type Attrs struct {
	ID          string
	OwnerID     string
	Title       string
	Description string
	Visibility  vo.Visibility
	Status      vo.Status
	FilePath    string
	FileSize    int64
	DurationMs  int64
	MimeType    *mimetype.MIME
}

func Build(attrs Attrs) (*Video, error) {
	if !attrs.Visibility.IsValid() {
		return nil, domainErrors.ErrInvalidVisibility
	}
	if !attrs.Status.IsValid() {
		return nil, domainErrors.ErrInvalidStatus
	}

	return &Video{
		id:          attrs.ID,
		ownerID:     attrs.OwnerID,
		title:       attrs.Title,
		description: attrs.Description,
		visibility:  attrs.Visibility,
		status:      attrs.Status,
		filePath:    attrs.FilePath,
		fileSize:    attrs.FileSize,
		durationMs:  attrs.DurationMs,
		mimeType:    attrs.MimeType,
	}, nil
}

type UpdateMetadataParams struct {
	Title       string
	Description string
	Visibility  vo.Visibility
}

func (v *Video) UpdateMetadata(params UpdateMetadataParams) error {
	if params.Visibility != "" && !params.Visibility.IsValid() {
		return domainErrors.ErrInvalidVisibility
	}

	v.title = params.Title
	v.description = params.Description
	if params.Visibility != "" {
		v.visibility = params.Visibility
	}

	return nil
}

func (v *Video) MarkReady(filePath string, fileSize int64, mimeType *mimetype.MIME, durationMs int64) {
	v.filePath = filePath
	if fileSize > 0 {
		v.fileSize = fileSize
	}
	if mimeType != nil {
		v.mimeType = mimeType
	}
	if durationMs > 0 {
		v.durationMs = durationMs
	}
	v.status = vo.StatusReady
}

var _ entityBase.BuilderFunc[Attrs, *Video] = Build
var _ entityBase.MetadataUpdatable[UpdateMetadataParams] = (*Video)(nil)
