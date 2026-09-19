package video

import (
	"fmt"

	domainErrors "videoStreaming/domain/errors"
	vo "videoStreaming/domain/valueObject"
)

type Visibility string

const (
	Private Visibility = "private"
	Public  Visibility = "public"
)

func NewVisibility(v string) (Visibility, error) {
	vis := Visibility(v)
	if !vis.IsValid() {
		return "", fmt.Errorf("%w: %s", domainErrors.ErrInvalidVisibility, v)
	}
	return vis, nil
}

func (v Visibility) IsValid() bool {
	switch v {
	case Private, Public:
		return true
	default:
		return false
	}
}

func (v Visibility) String() string {
	return string(v)
}

var _ vo.ValueObject = Visibility("")
var _ vo.BuilderFunc[string, Visibility] = NewVisibility
