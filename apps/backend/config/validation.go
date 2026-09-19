package config

import (
	"errors"
	"fmt"
)

var (
	// ErrRequiredEnvMissing is returned when a required environment variable is missing.
	ErrRequiredEnvMissing = errors.New("required environment variable missing")
)

// RequiredEnvKeys lists the environment variables that are required for the backend to function.
func RequiredEnvKeys() []string {
	return []string{
		"DATABASE_URL",
		"MINIO_ENDPOINT",
		"MINIO_ACCESS_KEY",
		"MINIO_SECRET_KEY",
		"MINIO_REGION",
		"MINIO_BUCKET",
		"TUS_BASE_PATH",
	}
}

// ValidateRequiredEnvs checks if all specified required environment variables are set and non-empty.
func ValidateRequiredEnvs(keys ...string) error {
	var missing []string
	for _, key := range keys {
		if GetEnv(key) == "" {
			missing = append(missing, key)
		}
	}
	if len(missing) > 0 {
		return fmt.Errorf("%w: %v", ErrRequiredEnvMissing, missing)
	}
	return nil
}

// Validate checks all default required environment variables.
func Validate() error {
	return ValidateRequiredEnvs(RequiredEnvKeys()...)
}
