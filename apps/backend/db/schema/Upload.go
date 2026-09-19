package schema

import "gorm.io/gorm"

type Upload struct {
	gorm.Model

	ID       string `gorm:"primaryKey;type:varchar(64)"`
	Filename string `gorm:"not null"`
	Status   string `gorm:"not null;type:varchar(16)"`
}
