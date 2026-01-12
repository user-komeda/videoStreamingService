package container

import "go.uber.org/fx"

//nolint:gochecknoglobals // App is the main entry point for the Fx application container.
var App = fx.Options(
	ApplicationModule,
	PresentationModule,
	CoreModule,
)
