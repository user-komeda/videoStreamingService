package tus

import (
	"context"
	"sync"

	"videoStreaming/domain/event/upload"
)

type UploadCompletedBus struct {
	mu       sync.RWMutex
	handlers []upload.CompletedInvoker
}

func NewUploadCompletedBus() *UploadCompletedBus {
	return &UploadCompletedBus{
		handlers: make([]upload.CompletedInvoker, 0),
	}
}

func (b *UploadCompletedBus) Subscribe(h upload.CompletedInvoker) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.handlers = append(b.handlers, h)
}

func (b *UploadCompletedBus) Publish(
	ctx context.Context,
	e upload.CompletedEvent,
) {
	b.mu.RLock()
	defer b.mu.RUnlock()

	for _, h := range b.handlers {
		h.Invoke(ctx, e)
	}
}
