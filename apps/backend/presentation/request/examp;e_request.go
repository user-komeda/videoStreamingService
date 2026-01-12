package example

import "errors"

type Request struct {
	Name string `json:"name"`
}

func Validate(req Request) error {
	if req.Name == "" {
		return errors.New("name is required")
	}
	return nil
}
