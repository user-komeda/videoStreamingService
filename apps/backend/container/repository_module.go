package container

import (
	domainUpload "videoStreaming/domain/repository/upload"
	domainVideo "videoStreaming/domain/repository/video"
	"videoStreaming/infrastructure/repository/upload"
	"videoStreaming/infrastructure/repository/video"

	"go.uber.org/fx"
)

// RepositoryModule はリポジトリ層の依存関係を管理します.
func RepositoryModule() fx.Option {
	return fx.Options(
		fx.Provide(
			fx.Annotate(
				upload.NewRepository,
				fx.As(new(domainUpload.Repository)),
			),
			fx.Annotate(
				video.NewRepository,
				fx.As(new(domainVideo.Repository)),
			),
		),
	)
}
