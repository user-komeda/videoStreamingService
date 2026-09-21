package upload

type Status string

const (
	StatusPending   Status = "pending"
	StatusCompleted Status = "completed"
	StatusFailed    Status = "failed"
)

type Upload struct {
	ID       string
	Filename string
	Status   Status
	TusID    string
}
