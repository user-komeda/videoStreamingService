package container

import (
	"videoStreaming/application/usecase/upload"
	"videoStreaming/domain/event"
	"videoStreaming/lib/tus"

	"go.uber.org/fx"
)

//nolint:gochecknoglobals // Fx modules must be global to be discovered during container initialization.
var ApplicationModule = fx.Options(
	fx.Provide(
		fx.Annotate(
			upload.NewUsecase,
			fx.As(new(event.UploadCompletedInvoker)),
		),
	),
	// wire subscription: EventBus -> Usecase
	fx.Invoke(func(
		bus *tus.UploadCompletedBus,
		uc event.UploadCompletedInvoker,
		sub *tus.Subscriber,
	) {
		// ★ 業務処理を登録
		bus.Subscribe(uc)

		sub.WatchCompletedUploads()
	}),
)
