package app

import (
	"context"

	"videoStreaming/config"

	"github.com/redis/go-redis/v9"
	"go.uber.org/fx"
)

func NewRedisClient(lc fx.Lifecycle, cfg config.RedisConfig) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     cfg.Addr,
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	lc.Append(fx.Hook{
		OnStop: func(_ context.Context) error {
			return client.Close()
		},
	})

	return client, nil
}
