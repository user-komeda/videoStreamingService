package tus_test

import (
	"context"
	"encoding/base64"
	"testing"
	"time"

	"videoStreaming/config"
	uploadEvent "videoStreaming/domain/event/upload"
	libtus "videoStreaming/lib/tus"

	tusd "github.com/tus/tusd/v2/pkg/handler"
)

type mockInvoker struct {
	invoked chan uploadEvent.CompletedEvent
}

func (m *mockInvoker) Invoke(_ context.Context, e uploadEvent.CompletedEvent) {
	m.invoked <- e
}

func TestUploadCompletedBus(t *testing.T) {
	bus := libtus.NewUploadCompletedBus()
	invoker := &mockInvoker{invoked: make(chan uploadEvent.CompletedEvent, 1)}
	bus.Subscribe(invoker)

	bus.Publish(t.Context(), uploadEvent.CompletedEvent{
		ID:       "test-id",
		Filename: "test.mp4",
	})

	select {
	case e := <-invoker.invoked:
		if e.ID != "test-id" || e.Filename != "test.mp4" {
			t.Fatalf("unexpected event received: %+v", e)
		}
	case <-time.After(time.Second):
		t.Fatalf("timed out waiting for event")
	}
}

func TestSubscriber(t *testing.T) {
	handler, err := libtus.NewHandler(config.TusConfig{
		BasePath: "/files/",
	}, nil, "test-bucket")
	if err != nil {
		t.Fatalf("failed to create tus handler: %v", err)
	}

	bus := libtus.NewUploadCompletedBus()
	invoker := &mockInvoker{invoked: make(chan uploadEvent.CompletedEvent, 3)}
	bus.Subscribe(invoker)

	subscriber := libtus.NewSubscriber(handler, bus)
	subscriber.WatchCompletedUploads()

	// 1. Event with base64 filename and videoId + multipart S3 upload ID
	encodedFilename := base64.StdEncoding.EncodeToString([]byte("sample_video.mp4"))
	encodedVideoID := base64.StdEncoding.EncodeToString([]byte("video-123"))
	encodedDuration := base64.StdEncoding.EncodeToString([]byte("12345"))
	handler.CompleteUploads <- tusd.HookEvent{
		Upload: tusd.FileInfo{
			ID:   "upload-1+multipart-upload-part-info",
			Size: 2048,
			MetaData: map[string]string{
				"filename":   encodedFilename,
				"videoId":    encodedVideoID,
				"durationMs": encodedDuration,
				"filetype":   "video/mp4",
			},
		},
	}

	// 2. Event with plain invalid base64 (fallback to raw string)
	handler.CompleteUploads <- tusd.HookEvent{
		Upload: tusd.FileInfo{
			ID: "upload-2",
			MetaData: map[string]string{
				"filename": "plain_filename.mp4!@#$%",
			},
		},
	}

	// 3. Event with float duration string
	handler.CompleteUploads <- tusd.HookEvent{
		Upload: tusd.FileInfo{
			ID: "upload-3",
			MetaData: map[string]string{
				"filename":   "float_duration.mp4",
				"durationMs": "12345.67",
			},
		},
	}

	select {
	case e1 := <-invoker.invoked:
		if e1.ID != "upload-1" ||
			e1.Filename != "sample_video.mp4" ||
			e1.VideoID != "video-123" ||
			e1.Size != 2048 ||
			e1.DurationMs != 12345 ||
			e1.MimeType != "video/mp4" {
			t.Fatalf("event 1 mismatch: %+v", e1)
		}
	case <-time.After(time.Second):
		t.Fatalf("timeout event 1")
	}

	select {
	case e2 := <-invoker.invoked:
		if e2.ID != "upload-2" || e2.Filename != "plain_filename.mp4!@#$%" {
			t.Fatalf("event 2 mismatch: %+v", e2)
		}
	case <-time.After(time.Second):
		t.Fatalf("timeout event 2")
	}

	select {
	case e3 := <-invoker.invoked:
		if e3.ID != "upload-3" || e3.DurationMs != 12345 {
			t.Fatalf("event 3 mismatch: %+v", e3)
		}
	case <-time.After(time.Second):
		t.Fatalf("timeout event 3")
	}
}
