package auth

import (
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrPasswordMismatch = errors.New("password does not match")
)

type PasswordService interface {
	HashPassword(password string) (string, error)
	ComparePassword(hash, password string) error
}

type passwordServiceImpl struct {
	cost int
}

func NewPasswordService() PasswordService {
	return &passwordServiceImpl{
		cost: bcrypt.DefaultCost,
	}
}

func (s *passwordServiceImpl) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), s.cost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(bytes), nil
}

func (s *passwordServiceImpl) ComparePassword(hash, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return ErrPasswordMismatch
		}
		return fmt.Errorf("failed to compare password: %w", err)
	}
	return nil
}
