package strage_test

import (
	"testing"

	"videoStreaming/app"
	"videoStreaming/config"
	"videoStreaming/lib/tus/strage"
)

func TestNewMinio3Client(t *testing.T) {
	cfg := config.MinIOConfig{
		Endpoint:  "http://localhost:9000",
		AccessKey: "minioadmin",
		SecretKey: "minioadmin",
		Region:    "us-east-1",
		Bucket:    "videos",
	}

	client, err := strage.NewMinio3Client(app.Context{Context: t.Context()}, cfg)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if client == nil {
		t.Fatal("expected client to be non-nil")
	}
}
