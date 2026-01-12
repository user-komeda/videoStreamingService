package event

import "context"

// UploadCompletedEvent is a domain event emitted when tus upload completes.
type UploadCompletedEvent struct {
	ID       string
	Filename string
}

// UploadCompletedInvoker defines the interface for handling upload completion.
type UploadCompletedInvoker interface {
	Invoke(ctx context.Context, e UploadCompletedEvent)
}
