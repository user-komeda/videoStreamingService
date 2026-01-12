package container

import (
	"log/slog"
	"os"
	"videoStreaming/app"
	"videoStreaming/config"
	domainRepository "videoStreaming/domain/repository"
	"videoStreaming/infrastructure/repository"
	libtus "videoStreaming/lib/tus"
	"videoStreaming/lib/tus/strage"

	"go.uber.org/fx"
)

func NewLogger() *slog.Logger {
	// 本番環境なら JSONHandler、開発環境なら TextHandler にすると使いやすいです
	handler := slog.NewJSONHandler(os.Stdout, nil)
	return slog.New(handler)
}

//nolint:gochecknoglobals // CoreModule defines cross-cutting concerns for the application.
var CoreModule = fx.Options(
	fx.Provide(
		NewLogger,
		config.DefaultConfig,
		app.NewAppContext,
		app.NewGinEngine,

		func(cfg config.Config) config.DBConfig { return cfg.DB },
		func(cfg config.Config) config.MinIOConfig { return cfg.MinIO },
		func(cfg config.Config) config.TusConfig { return cfg.Tus },
		func(cfg config.Config) string { return cfg.MinIO.Bucket },

		app.NewGormDB,

		fx.Annotate(
			repository.NewUploadRepository,
			fx.As(new(domainRepository.UploadRepository)),
		),

		// lib
		strage.NewMinio3Client,
		libtus.NewHandler,
		libtus.NewSubscriber,

		libtus.NewUploadCompletedBus,
	),

	fx.Invoke(app.RegisterHTTPServer),
)
