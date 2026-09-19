package usecase

import "context"

type UseCase[I any, O any] interface {
	Invoke(ctx context.Context, input I) (O, error)
}

type NoInputUseCase[O any] interface {
	Invoke(ctx context.Context) (O, error)
}

type NoOutputUseCase[I any] interface {
	Invoke(ctx context.Context, input I) error
}

type NoInputNoOutputUseCase interface {
	Invoke(ctx context.Context) error
}
