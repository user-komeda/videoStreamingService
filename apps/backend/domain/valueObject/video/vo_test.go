package video_test

import (
	"testing"

	"videoStreaming/domain/valueObject/video"
)

func TestStatus(t *testing.T) {
	st, err := video.NewStatus("ready")
	if err != nil || st != video.StatusReady {
		t.Fatalf("expected StatusReady, got %v, err: %v", st, err)
	}

	stNotReady, err := video.NewStatus("notReady")
	if err != nil || stNotReady != video.StatusNotReady {
		t.Fatalf("expected StatusNotReady, got %v, err: %v", stNotReady, err)
	}

	if st.String() != "ready" {
		t.Fatalf("expected string 'ready', got %s", st.String())
	}

	_, err = video.NewStatus("invalid")
	if err == nil {
		t.Fatalf("expected error for invalid status")
	}
}

func TestVisibility(t *testing.T) {
	vPub, err := video.NewVisibility("public")
	if err != nil || vPub != video.Public {
		t.Fatalf("expected Public, got %v, err: %v", vPub, err)
	}

	vPriv, err := video.NewVisibility("private")
	if err != nil || vPriv != video.Private {
		t.Fatalf("expected Private, got %v, err: %v", vPriv, err)
	}

	if vPub.String() != "public" {
		t.Fatalf("expected string 'public', got %s", vPub.String())
	}

	_, err = video.NewVisibility("invalid")
	if err == nil {
		t.Fatalf("expected error for invalid visibility")
	}
}
