package request

type DtoConverter[TDto any] interface {
	ToDto() (TDto, error)
}
