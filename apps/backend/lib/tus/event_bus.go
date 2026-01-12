package tus

import (
	"context"
	"sync"

	"videoStreaming/domain/event"
)

type UploadCompletedBus struct {
	mu       sync.RWMutex
	handlers []event.UploadCompletedInvoker
}

func NewUploadCompletedBus() *UploadCompletedBus {
	return &UploadCompletedBus{
		handlers: make([]event.UploadCompletedInvoker, 0),
	}
}

func (b *UploadCompletedBus) Subscribe(h event.UploadCompletedInvoker) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.handlers = append(b.handlers, h)
}

func (b *UploadCompletedBus) Publish(
	ctx context.Context,
	e event.UploadCompletedEvent,
) {
	b.mu.RLock()
	defer b.mu.RUnlock()

	for _, h := range b.handlers {
		h.Invoke(ctx, e)
	}
}
