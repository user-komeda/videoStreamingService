package errors_test

import (
	"errors"
	"testing"

	appErrors "videoStreaming/application/errors"
	domainErrors "videoStreaming/domain/errors"
)

func assertAppError(
	t *testing.T,
	result *appErrors.AppError,
	originalErr error,
	expectedCode appErrors.ErrorCode,
	expectedMsg string,
) {
	t.Helper()
	if result == nil {
		t.Fatalf("expected non-nil error")
	}
	if result.Code != expectedCode {
		t.Errorf("expected code %s, got %s", expectedCode, result.Code)
	}
	if result.Message != expectedMsg {
		t.Errorf("expected message %s, got %s", expectedMsg, result.Message)
	}
	if !errors.Is(result, originalErr) && !errors.Is(result.Err, originalErr) {
		t.Errorf("expected unwrapped error to match %v", originalErr)
	}
}

func TestFromDomainError_Nil(t *testing.T) {
	result := appErrors.FromDomainError(nil, "default")
	if result != nil {
		t.Fatalf("expected nil, got %v", result)
	}
}

func TestFromDomainError(t *testing.T) {
	tests := []struct {
		name         string
		err          error
		defaultMsg   string
		expectedCode appErrors.ErrorCode
		expectedMsg  string
	}{
		{
			name:         "ErrNotFound maps to CodeNotFound",
			err:          domainErrors.ErrNotFound,
			defaultMsg:   "video not found",
			expectedCode: appErrors.CodeNotFound,
			expectedMsg:  "video not found",
		},
		{
			name:         "ErrAlreadyExists maps to CodeConflict",
			err:          domainErrors.ErrAlreadyExists,
			defaultMsg:   "video already exists",
			expectedCode: appErrors.CodeConflict,
			expectedMsg:  "video already exists",
		},
		{
			name:         "ErrForeignKeyViolation maps to CodeInvalidArgument",
			err:          domainErrors.ErrForeignKeyViolation,
			defaultMsg:   "invalid relation",
			expectedCode: appErrors.CodeInvalidArgument,
			expectedMsg:  "invalid relation",
		},
		{
			name:         "ErrInvalidStatus maps to CodeInvalidArgument",
			err:          domainErrors.ErrInvalidStatus,
			defaultMsg:   "invalid status",
			expectedCode: appErrors.CodeInvalidArgument,
			expectedMsg:  "invalid status",
		},
		{
			name:         "ErrInvalidVisibility maps to CodeInvalidArgument",
			err:          domainErrors.ErrInvalidVisibility,
			defaultMsg:   "invalid visibility",
			expectedCode: appErrors.CodeInvalidArgument,
			expectedMsg:  "invalid visibility",
		},
		{
			name:         "ErrInternal maps to CodeInternal",
			err:          domainErrors.ErrInternal,
			defaultMsg:   "internal db error",
			expectedCode: appErrors.CodeInternal,
			expectedMsg:  "internal db error",
		},
		{
			name:         "Unknown error maps to CodeInternal",
			err:          errors.New("something went wrong"),
			defaultMsg:   "unexpected error",
			expectedCode: appErrors.CodeInternal,
			expectedMsg:  "unexpected error",
		},
		{
			name:         "Already AppError returns as is",
			err:          appErrors.NewAppError(appErrors.CodeForbidden, "access forbidden", nil),
			defaultMsg:   "default",
			expectedCode: appErrors.CodeForbidden,
			expectedMsg:  "access forbidden",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := appErrors.FromDomainError(tt.err, tt.defaultMsg)
			assertAppError(t, result, tt.err, tt.expectedCode, tt.expectedMsg)
		})
	}
}

func TestAppError_ErrorMethod(t *testing.T) {
	errWithInner := appErrors.NewAppError(
		appErrors.CodeNotFound,
		"not found item",
		errors.New("inner error"),
	)
	if errWithInner.Error() != "[NOT_FOUND] not found item: inner error" {
		t.Fatalf("unexpected error message: %s", errWithInner.Error())
	}

	errWithoutInner := appErrors.NewAppError(appErrors.CodeForbidden, "forbidden item", nil)
	if errWithoutInner.Error() != "[FORBIDDEN] forbidden item" {
		t.Fatalf("unexpected error message: %s", errWithoutInner.Error())
	}

	// default messages when defaultMsg is empty
	res := appErrors.FromDomainError(domainErrors.ErrNotFound, "")
	if res.Message != "resource not found" {
		t.Fatalf("expected default message, got %s", res.Message)
	}

	resUnknown := appErrors.FromDomainError(errors.New("other"), "")
	if resUnknown.Message != "internal server error" {
		t.Fatalf("expected default internal server error message, got %s", resUnknown.Message)
	}
}
