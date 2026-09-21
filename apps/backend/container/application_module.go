package container

import (
	"videoStreaming/application/usecase/stream"
	"videoStreaming/application/usecase/upload"
	"videoStreaming/application/usecase/video"
	uploadEvent "videoStreaming/domain/event/upload"
	"videoStreaming/lib/tus"

	"go.uber.org/fx"
)

// ApplicationModule はアプリケーション層（ユースケース）の依存関係を管理します.
func ApplicationModule() fx.Option {
	return fx.Options(
		fx.Provide(
			fx.Annotate(
				upload.NewUsecase,
				fx.As(new(uploadEvent.CompletedInvoker)),
			),
			video.NewCreateUseCase,
			video.NewGetAllUseCase,
			video.NewGetDetailUseCase,
			video.NewUpdateUseCase,
			video.NewDeleteUseCase,
			stream.NewUseCase,
		),
		// wire subscription: EventBus -> Usecase
		fx.Invoke(func(
			bus *tus.UploadCompletedBus,
			uc uploadEvent.CompletedInvoker,
			sub *tus.Subscriber,
		) {
			// ★ 業務処理を登録
			bus.Subscribe(uc)

			sub.WatchCompletedUploads()
		}),
	)
}
