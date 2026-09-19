package tus

import (
	"context"
	"encoding/base64"
	"strconv"
	"strings"

	"videoStreaming/domain/event/upload"
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
			print("uploadID")
			print(e.Upload.ID)
			uploadID, _, _ := strings.Cut(e.Upload.ID, "+")
			print(uploadID)
			filename := extractMeta(e.Upload.MetaData, "filename")
			videoID := extractMeta(e.Upload.MetaData, "videoId", "video_id")
			mimeType := extractMeta(e.Upload.MetaData, "filetype", "type")
			durationMsStr := extractMeta(e.Upload.MetaData, "durationMs", "duration_ms", "duration")

			var durationMs int64
			if durationMsStr != "" {
				if d, parseErr := strconv.ParseInt(durationMsStr, 10, 64); parseErr == nil {
					durationMs = d
				} else if f, floatErr := strconv.ParseFloat(durationMsStr, 64); floatErr == nil {
					durationMs = int64(f)
				}
			}

			// ★ event 発火
			s.bus.Publish(
				context.Background(),
				upload.CompletedEvent{
					ID:         uploadID,
					VideoID:    videoID,
					Filename:   filename,
					Size:       e.Upload.Size,
					DurationMs: durationMs,
					MimeType:   mimeType,
				},
			)
		}
	}()
}

func extractMeta(meta map[string]string, keys ...string) string {
	for _, k := range keys {
		if v, ok := meta[k]; ok {
			return decode(v)
		}
	}
	return ""
}

func decode(v string) string {
	b, err := base64.StdEncoding.DecodeString(strings.TrimSpace(v))
	if err != nil {
		return v
	}
	return string(b)
}
