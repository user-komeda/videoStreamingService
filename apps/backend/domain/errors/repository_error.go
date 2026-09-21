package errors

import "errors"

var (
	ErrNotFound            = errors.New("resource not found")
	ErrAlreadyExists       = errors.New("resource already exists")
	ErrForeignKeyViolation = errors.New("foreign key violation")
	ErrInternal            = errors.New("internal domain error")
)
