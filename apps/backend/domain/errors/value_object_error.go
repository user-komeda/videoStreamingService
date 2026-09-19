package errors

import "errors"

var (
	ErrInvalidStatus     = errors.New("invalid video status")
	ErrInvalidVisibility = errors.New("invalid video visibility")
)
