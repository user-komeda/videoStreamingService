package config

import (
	"errors"
	"fmt"
	"os"
	"strconv"
)

var (
	// ErrInvalidEnv is returned when an environment variable value is invalid.
	ErrInvalidEnv = errors.New("invalid environment variable")
)

// GetEnv returns the value of the environment variable named by key,
// or an empty string if the variable is not set.
func GetEnv(key string) string {
	return os.Getenv(key)
}

// GetEnvInt returns the integer value of the environment variable named by key.
// If the variable is not set or empty, it returns 0. If the value cannot be parsed as an int, an error is returned.
func GetEnvInt(key string) (int, error) {
	val := os.Getenv(key)
	if val == "" {
		return 0, nil
	}
	i, err := strconv.Atoi(val)
	if err != nil {
		return 0, fmt.Errorf("%w: key %s has invalid integer value %q: %w", ErrInvalidEnv, key, val, err)
	}
	return i, nil
}

// GetEnvBool returns the boolean value of the environment variable named by key.
// If the variable is not set or empty, it returns false. If the value cannot be parsed as a bool, an error is returned.
func GetEnvBool(key string) (bool, error) {
	val := os.Getenv(key)
	if val == "" {
		return false, nil
	}
	b, err := strconv.ParseBool(val)
	if err != nil {
		return false, fmt.Errorf("%w: key %s has invalid boolean value %q: %w", ErrInvalidEnv, key, val, err)
	}
	return b, nil
}
