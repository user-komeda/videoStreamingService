package app

import (
	"videoStreaming/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewGormDB(cfg config.DBConfig) (*gorm.DB, error) {
	return gorm.Open(postgres.Open(cfg.DSN), &gorm.Config{})
}
