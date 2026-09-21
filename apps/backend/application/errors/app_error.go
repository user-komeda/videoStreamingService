package errors

import (
	"cmp"
	"errors"
	"fmt"

	domainErrors "videoStreaming/domain/errors"
)

type ErrorCode string

const (
	CodeUnauthorized    ErrorCode = "UNAUTHORIZED"
	CodeForbidden       ErrorCode = "FORBIDDEN"
	CodeInvalidArgument ErrorCode = "INVALID_ARGUMENT"
	CodeNotFound        ErrorCode = "NOT_FOUND"
	CodeConflict        ErrorCode = "CONFLICT"
	CodeInternal        ErrorCode = "INTERNAL_SERVER_ERROR"
)

type AppError struct {
	Code    ErrorCode
	Message string
	Err     error
}

func NewAppError(code ErrorCode, message string, err error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("[%s] %s: %v", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("[%s] %s", e.Code, e.Message)
}

func (e *AppError) Unwrap() error {
	return e.Err
}

type domainErrorMapping struct {
	target         error
	code           ErrorCode
	defaultMessage string
}

func getDomainErrorMappings() []domainErrorMapping {
	const msgInvalidArgument = "invalid argument"

	return []domainErrorMapping{
		{target: domainErrors.ErrNotFound, code: CodeNotFound, defaultMessage: "resource not found"},
		{
			target:         domainErrors.ErrAlreadyExists,
			code:           CodeConflict,
			defaultMessage: "resource already exists",
		},
		{
			target:         domainErrors.ErrForeignKeyViolation,
			code:           CodeInvalidArgument,
			defaultMessage: msgInvalidArgument,
		},
		{
			target:         domainErrors.ErrInvalidStatus,
			code:           CodeInvalidArgument,
			defaultMessage: msgInvalidArgument,
		},
		{
			target:         domainErrors.ErrInvalidVisibility,
			code:           CodeInvalidArgument,
			defaultMessage: msgInvalidArgument,
		},
		{target: domainErrors.ErrInternal, code: CodeInternal, defaultMessage: "internal server error"},
	}
}

func FromDomainError(err error, defaultMessage string) *AppError {
	if err == nil {
		return nil
	}

	if appErr, ok := errors.AsType[*AppError](err); ok {
		return appErr
	}

	for _, mapping := range getDomainErrorMappings() {
		if errors.Is(err, mapping.target) {
			return NewAppError(mapping.code, cmp.Or(defaultMessage, mapping.defaultMessage), err)
		}
	}

	return NewAppError(CodeInternal, cmp.Or(defaultMessage, "internal server error"), err)
}
