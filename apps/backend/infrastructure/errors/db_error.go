package errors

import (
	"errors"
	"fmt"

	domainErrors "videoStreaming/domain/errors"

	"github.com/jackc/pgx/v5/pgconn"
	"gorm.io/gorm"
)

func MapDBError(err error) error {
	if err == nil {
		return nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return domainErrors.ErrNotFound
	}

	if pgErr, ok := errors.AsType[*pgconn.PgError](err); ok {
		switch pgErr.Code {
		case "23505":
			return domainErrors.ErrAlreadyExists
		case "23503":
			return domainErrors.ErrForeignKeyViolation
		}
	}

	return fmt.Errorf("%w: %w", domainErrors.ErrInternal, err)
}
