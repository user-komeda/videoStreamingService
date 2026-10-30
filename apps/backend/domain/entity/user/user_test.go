package user_test

import (
	"testing"
	"time"

	"videoStreaming/domain/entity/user"
)

func TestUser_Build_And_Getters(t *testing.T) {
	now := time.Now()
	attrs := user.Attrs{
		ID:           "u-123",
		Email:        "user@example.com",
		PasswordHash: "hashed_password",
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	u, err := user.Build(attrs)
	if err != nil {
		t.Fatalf("unexpected error building user: %v", err)
	}

	if u.ID() != "u-123" {
		t.Fatalf("expected ID u-123, got %s", u.ID())
	}
	if u.Email() != "user@example.com" {
		t.Fatalf("expected Email user@example.com, got %s", u.Email())
	}
	if u.PasswordHash() != "hashed_password" {
		t.Fatalf("expected PasswordHash hashed_password, got %s", u.PasswordHash())
	}
	if !u.CreatedAt().Equal(now) {
		t.Fatalf("expected CreatedAt %v, got %v", now, u.CreatedAt())
	}
	if !u.UpdatedAt().Equal(now) {
		t.Fatalf("expected UpdatedAt %v, got %v", now, u.UpdatedAt())
	}
}
