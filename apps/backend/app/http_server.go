package app

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/fx"

	"videoStreaming/config"
)

const defaultReadHeaderTimeout = 5 * time.Second

func RegisterHTTPServer(lc fx.Lifecycle, cfg config.Config, r *gin.Engine) {
	srv := &http.Server{
		Addr:              cfg.ServerPort,
		Handler:           r,
		ReadHeaderTimeout: defaultReadHeaderTimeout,
	}

	lc.Append(fx.Hook{
		OnStart: func(context.Context) error {
			go func() {
				_ = srv.ListenAndServe()
			}()
			return nil
		},
		OnStop: func(ctx context.Context) error {
			return srv.Shutdown(ctx)
		},
	})
}
