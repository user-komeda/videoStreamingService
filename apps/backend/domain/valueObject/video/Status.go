package video

import (
	"fmt"

	domainErrors "videoStreaming/domain/errors"
	vo "videoStreaming/domain/valueObject"
)

type Status string

const (
	StatusNotReady Status = "notReady"
	StatusReady    Status = "ready"
)

func NewStatus(s string) (Status, error) {
	st := Status(s)
	if !st.IsValid() {
		return "", fmt.Errorf("%w: %s", domainErrors.ErrInvalidStatus, s)
	}
	return st, nil
}

func (s Status) IsValid() bool {
	switch s {
	case StatusNotReady, StatusReady:
		return true
	default:
		return false
	}
}

func (s Status) String() string {
	return string(s)
}

var _ vo.ValueObject = Status("")
var _ vo.BuilderFunc[string, Status] = NewStatus
