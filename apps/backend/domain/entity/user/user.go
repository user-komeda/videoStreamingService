package user

import (
	"time"
)

type User struct {
	id           string
	email        string
	passwordHash string
	createdAt    time.Time
	updatedAt    time.Time
}

func (u *User) ID() string           { return u.id }
func (u *User) Email() string        { return u.email }
func (u *User) PasswordHash() string { return u.passwordHash }
func (u *User) CreatedAt() time.Time { return u.createdAt }
func (u *User) UpdatedAt() time.Time { return u.updatedAt }

type Attrs struct {
	ID           string
	Email        string
	PasswordHash string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func Build(attrs Attrs) (*User, error) {
	return &User{
		id:           attrs.ID,
		email:        attrs.Email,
		passwordHash: attrs.PasswordHash,
		createdAt:    attrs.CreatedAt,
		updatedAt:    attrs.UpdatedAt,
	}, nil
}
