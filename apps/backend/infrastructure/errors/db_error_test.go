package errors_test

import (
	"errors"
	"testing"

	domainErrors "videoStreaming/domain/errors"
	infraErrors "videoStreaming/infrastructure/errors"

	"github.com/jackc/pgx/v5/pgconn"
	"gorm.io/gorm"
)

func TestMapDBError(t *testing.T) {
	// nil
	if infraErrors.MapDBError(nil) != nil {
		t.Fatalf("expected nil for nil error")
	}

	// ErrRecordNotFound
	err := infraErrors.MapDBError(gorm.ErrRecordNotFound)
	if !errors.Is(err, domainErrors.ErrNotFound) {
		t.Fatalf("expected ErrNotFound, got %v", err)
	}

	// PgError 23505 (Unique violation)
	err = infraErrors.MapDBError(&pgconn.PgError{Code: "23505"})
	if !errors.Is(err, domainErrors.ErrAlreadyExists) {
		t.Fatalf("expected ErrAlreadyExists, got %v", err)
	}

	// PgError 23503 (Foreign key violation)
	err = infraErrors.MapDBError(&pgconn.PgError{Code: "23503"})
	if !errors.Is(err, domainErrors.ErrForeignKeyViolation) {
		t.Fatalf("expected ErrForeignKeyViolation, got %v", err)
	}

	// PgError other code
	err = infraErrors.MapDBError(&pgconn.PgError{Code: "42P01"})
	if !errors.Is(err, domainErrors.ErrInternal) {
		t.Fatalf("expected ErrInternal, got %v", err)
	}

	// Generic unknown error
	err = infraErrors.MapDBError(errors.New("connection reset"))
	if !errors.Is(err, domainErrors.ErrInternal) {
		t.Fatalf("expected ErrInternal, got %v", err)
	}
}
