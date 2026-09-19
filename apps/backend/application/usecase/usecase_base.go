package usecase

import "context"

type BaseUseCase[I any] interface {
	Invoke(ctx context.Context, input I) error
}
