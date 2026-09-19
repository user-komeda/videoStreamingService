package container

import "go.uber.org/fx"

// App はアプリケーション全体のFxオプションを返します.
func App() fx.Option {
	return fx.Options(
		CoreModule(),
		LibModule(),
		RepositoryModule(),
		ApplicationModule(),
		PresentationModule(),
	)
}
