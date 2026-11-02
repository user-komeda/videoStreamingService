package auth_test

import (
	"testing"

	authDto "videoStreaming/application/dto/auth"
	respAuth "videoStreaming/presentation/response/auth"
)

func TestAuthResponse_FromDto_Nil(t *testing.T) {
	if respAuth.FromDto(nil) != nil {
		t.Fatalf("expected nil response for nil dto")
	}
}

func TestAuthResponse_FromDto_Valid(t *testing.T) {
	dto := &authDto.ResultDto{
		UserID: "user-123",
	}

	res := respAuth.FromDto(dto)
	if res == nil {
		t.Fatalf("expected non-nil response")
	}

	if res.UserID != "user-123" {
		t.Fatalf("expected UserID user-123, got %s", res.UserID)
	}
}
