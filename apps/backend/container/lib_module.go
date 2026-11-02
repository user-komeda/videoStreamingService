package container

import (
	infraAuth "videoStreaming/infrastructure/auth"
	libtus "videoStreaming/lib/tus"
	"videoStreaming/lib/tus/strage"

	"go.uber.org/fx"
)

// LibModule は外部ライブラリやクライアント等の依存関係を管理します.
func LibModule() fx.Option {
	return fx.Options(
		fx.Provide(
			strage.NewMinio3Client,
			libtus.NewHandler,
			libtus.NewSubscriber,
			libtus.NewUploadCompletedBus,
			infraAuth.NewPasswordService,
		),
	)
}
