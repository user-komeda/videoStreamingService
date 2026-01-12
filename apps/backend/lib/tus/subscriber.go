package tus

import (
	"context"
	"encoding/base64"
	"strings"

	"videoStreaming/domain/event"
)

type Subscriber struct {
	h   *Handler
	bus *UploadCompletedBus
}

func NewSubscriber(
	h *Handler,
	bus *UploadCompletedBus,
) *Subscriber {
	return &Subscriber{h: h, bus: bus}
}

func (s *Subscriber) WatchCompletedUploads() {
	go func() {
		for e := range s.h.CompleteUploads {
			filename := ""
			if v, ok := e.Upload.MetaData["filename"]; ok {
				filename = decode(v)
			}

			// ★ event 発火
			s.bus.Publish(
				context.Background(),
				event.UploadCompletedEvent{
					ID:       e.Upload.ID,
					Filename: filename,
				},
			)
		}
	}()
}

func decode(v string) string {
	b, err := base64.StdEncoding.DecodeString(strings.TrimSpace(v))
	if err != nil {
		return v
	}
	return string(b)
}
