package entity

type DomainConverter[TDomain any] interface {
	ToDomain() (TDomain, error)
}

type InfraEntityBuilderFunc[TDomain any, TInfra any] func(domain TDomain) (TInfra, error)
