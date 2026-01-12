package entity

type UploadStatus string

const (
	UploadPending   UploadStatus = "pending"
	UploadCompleted UploadStatus = "completed"
	UploadFailed    UploadStatus = "failed"
)

type Upload struct {
	ID       string
	Filename string
	Status   UploadStatus
	TusID    string
}
