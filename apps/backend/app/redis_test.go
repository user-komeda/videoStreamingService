package app_test

import (
	"testing"

	"videoStreaming/app"
	"videoStreaming/config"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/fx/fxtest"
)

func TestNewRedisClient(t *testing.T) {
	lc := fxtest.NewLifecycle(t)
	cfg := config.RedisConfig{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	}

	client, err := app.NewRedisClient(lc, cfg)
	require.NoError(t, err)
	require.NotNil(t, client)
	assert.Equal(t, "localhost:6379", client.Options().Addr)

	err = lc.Start(t.Context())
	require.NoError(t, err)

	err = lc.Stop(t.Context())
	require.NoError(t, err)
}
