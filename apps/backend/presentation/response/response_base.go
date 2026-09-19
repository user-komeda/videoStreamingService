package response

type FromDtoFunc[TDto any, TResponse any] func(dto TDto) TResponse

type FromDtoListFunc[TDto any, TResponse any] func(dtos []TDto) []TResponse

type FromDtoPaginationFunc[TDto any, TPaginationResponse any] func(dtos []TDto, param PaginationParam) TPaginationResponse

type PaginationParam struct {
	Total   int64
	Page    int
	PerPage int
}

func NewPaginationParam(total int64, page, perPage int) PaginationParam {
	return PaginationParam{
		Total:   total,
		Page:    page,
		PerPage: perPage,
	}
}

type PaginationMeta struct {
	Total      int64 `json:"total"`
	Page       int   `json:"page"`
	PerPage    int   `json:"per_page"`
	TotalPages int   `json:"total_pages"`
	HasNext    bool  `json:"has_next"`
}

func NewPaginationMeta(param PaginationParam) PaginationMeta {
	totalPages := 0
	if param.PerPage > 0 {
		totalPages = int((param.Total + int64(param.PerPage) - 1) / int64(param.PerPage))
	}

	return PaginationMeta{
		Total:      param.Total,
		Page:       param.Page,
		PerPage:    param.PerPage,
		TotalPages: totalPages,
		HasNext:    param.Page < totalPages,
	}
}

type ErrorResponse struct {
	Message string   `json:"message"`
	Details []string `json:"details,omitempty"`
}

func NewErrorResponse(message string, details ...string) *ErrorResponse {
	return &ErrorResponse{
		Message: message,
		Details: details,
	}
}
