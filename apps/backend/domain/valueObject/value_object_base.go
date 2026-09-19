package valueobject

import "fmt"

type ValueObject interface {
	fmt.Stringer
	IsValid() bool
}

type BuilderFunc[TValue any, TVo any] func(val TValue) (TVo, error)
