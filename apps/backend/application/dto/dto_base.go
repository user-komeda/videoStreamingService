package dto

type BuilderFunc[TAttrs any, TDto any] func(attrs TAttrs) (TDto, error)

type BuilderWithIDFunc[TAttrs any, TDto any] func(id string, attrs TAttrs) (TDto, error)

type EntityConverter[TEntity any] interface {
	ConvertToDomainEntity() (TEntity, error)
}

type UpdateParamsConverter[TParams any] interface {
	ToUpdateParams() TParams
}

type FromDomainFunc[TEntity any, TDto any] func(entity TEntity) TDto

type FromDomainListFunc[TEntity any, TDto any] func(entities []TEntity) []TDto
