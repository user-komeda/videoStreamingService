package upload

import "context"

type CompletedEvent struct {
	ID         string
	VideoID    string
	Filename   string
	Size       int64
	DurationMs int64
	MimeType   string
}

type CompletedInvoker interface {
	Invoke(ctx context.Context, e CompletedEvent)
}
