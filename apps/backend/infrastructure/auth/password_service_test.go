package auth_test

import (
	"errors"
	"testing"

	infraAuth "videoStreaming/infrastructure/auth"
)

func TestPasswordService_HashAndCompare(t *testing.T) {
	service := infraAuth.NewPasswordService()

	password := "mySecretPassword123"
	hash, hashErr := service.HashPassword(password)
	if hashErr != nil {
		t.Fatalf("unexpected error hashing password: %v", hashErr)
	}

	if hash == "" || hash == password {
		t.Fatalf("invalid hash output: %s", hash)
	}

	if compErr := service.ComparePassword(hash, password); compErr != nil {
		t.Fatalf("expected password to match, got error: %v", compErr)
	}

	if compErr := service.ComparePassword(hash, "wrongPassword"); !errors.Is(compErr, infraAuth.ErrPasswordMismatch) {
		t.Fatalf("expected ErrPasswordMismatch, got %v", compErr)
	}

	// Test error when password exceeds bcrypt max length (72 bytes)
	longPassword := string(make([]byte, 80))
	if _, longErr := service.HashPassword(longPassword); longErr == nil {
		t.Fatalf("expected error for password exceeding max length, got nil")
	}

	// Test error when hash is malformed
	if invalidHashErr := service.ComparePassword(
		"invalid_hash_string",
		password,
	); invalidHashErr == nil ||
		errors.Is(invalidHashErr, infraAuth.ErrPasswordMismatch) {
		t.Fatalf("expected general comparison error for invalid hash, got %v", invalidHashErr)
	}
}
