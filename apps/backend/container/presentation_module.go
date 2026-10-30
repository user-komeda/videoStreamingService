package container

import (
	"videoStreaming/presentation/controller/auth"
	"videoStreaming/presentation/controller/health"
	"videoStreaming/presentation/controller/stream"
	"videoStreaming/presentation/controller/tus"
	"videoStreaming/presentation/controller/video"
	"videoStreaming/route"

	"go.uber.org/fx"
)

// PresentationModule はプレゼンテーション層の依存関係を管理します.
func PresentationModule() fx.Option {
	return fx.Options(
		fx.Provide(
			auth.NewController,
			health.NewController,
			stream.NewController,
			tus.NewController,
			video.NewController,
		),
		fx.Invoke(
			route.RegisterAuth,
			route.RegisterHealth,
			route.RegisterStream,
			route.RegisterTus,
			route.RegisterVideo,
			route.RegisterSwagger,
		),
	)
}
