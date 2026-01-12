package app

import (
	"context"

	"go.uber.org/fx"
)

// Context is lifecycle-cancelled root context for internal background work.
type Context struct{ context.Context }

func NewAppContext(lc fx.Lifecycle) Context {
	ctx, cancel := context.WithCancel(context.Background())

	lc.Append(fx.Hook{
		OnStop: func(context.Context) error {
			cancel()
			return nil
		},
	})

	return Context{Context: ctx}
}
