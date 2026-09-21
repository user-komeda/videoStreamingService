package entity

type BuilderFunc[TAttrs any, TEntity any] func(attrs TAttrs) (TEntity, error)

type MetadataUpdatable[TParams any] interface {
	UpdateMetadata(params TParams) error
}
