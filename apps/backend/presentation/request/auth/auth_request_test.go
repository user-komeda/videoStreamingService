package auth_test

import (
	"testing"

	reqAuth "videoStreaming/presentation/request/auth"
)

func TestAuthRequest_SignUpRequest_ToDto(t *testing.T) {
	req := reqAuth.SignUpRequest{
		Email:    "test@example.com",
		Password: "password123",
	}

	dto := req.ToDto()
	if dto.Email != "test@example.com" {
		t.Fatalf("expected Email test@example.com, got %s", dto.Email)
	}
	if dto.Password != "password123" {
		t.Fatalf("expected Password password123, got %s", dto.Password)
	}
}

func TestAuthRequest_SignInRequest_ToDto(t *testing.T) {
	req := reqAuth.SignInRequest{
		Email:    "test@example.com",
		Password: "password123",
	}

	dto := req.ToDto()
	if dto.Email != "test@example.com" {
		t.Fatalf("expected Email test@example.com, got %s", dto.Email)
	}
	if dto.Password != "password123" {
		t.Fatalf("expected Password password123, got %s", dto.Password)
	}
}
