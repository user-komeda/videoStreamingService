package container

import (
	"log/slog"
	"os"

	"videoStreaming/app"
	"videoStreaming/config"

	"go.uber.org/fx"
)

func NewLogger() *slog.Logger {
	handler := slog.NewJSONHandler(os.Stdout, nil)
	return slog.New(handler)
}

// CoreModule はコア層の依存関係を管理します.
func CoreModule() fx.Option {
	return fx.Options(
		fx.Provide(
			NewLogger,
			config.NewConfig,
			app.NewAppContext,
			app.NewGinEngine,

			func(cfg config.Config) config.DBConfig { return cfg.DB },
			func(cfg config.Config) config.MinIOConfig { return cfg.MinIO },
			func(cfg config.Config) config.TusConfig { return cfg.Tus },
			func(cfg config.Config) string { return cfg.MinIO.Bucket },

			app.NewGormDB,
		),
		fx.Invoke(app.RegisterHTTPServer),
	)
}
