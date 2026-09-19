package container

import (
	"videoStreaming/presentation/controller/health"
	"videoStreaming/presentation/controller/tus"
	"videoStreaming/route"

	"go.uber.org/fx"
)

//nolint:gochecknoglobals // PresentationModule configures the web/API layer.
var PresentationModule = fx.Options(
	fx.Provide(
		health.NewController,
		tus.NewController,
	),
	fx.Invoke(
		route.RegisterHealth,
		route.RegisterTus,
	),
)
