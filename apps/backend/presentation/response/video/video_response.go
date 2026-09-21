package video

import (
	"fmt"
	"strings"

	applicationDto "videoStreaming/application/dto/video"
	"videoStreaming/presentation/response"
)

type Response struct {
	ID          string  `json:"id"`
	OwnerID     string  `json:"owner_id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Visibility  string  `json:"visibility"`
	Status      string  `json:"status"`
	FilePath    string  `json:"file_path,omitempty"`
	FileSize    int64   `json:"file_size,omitempty"`
	DurationMs  int64   `json:"duration_ms"`
	MimeType    *string `json:"mime_type,omitempty"`
}

type PaginationResponse struct {
	Videos     []*Response             `json:"videos"`
	Pagination response.PaginationMeta `json:"pagination"`
}

func FromDto(dto *applicationDto.Dto) *Response {
	if dto == nil {
		return nil
	}

	var mimeType *string
	if dto.MimeType() != "" {
		str := dto.MimeType()
		mimeType = &str
	}

	filePath := dto.FilePath()
	if filePath != "" && !strings.HasPrefix(filePath, "http") && !strings.HasPrefix(filePath, "/") {
		filePath = fmt.Sprintf("/videos/%s/stream", dto.ID())
	}

	return &Response{
		ID:          dto.ID(),
		OwnerID:     dto.OwnerID(),
		Title:       dto.Title(),
		Description: dto.Description(),
		Visibility:  string(dto.Visibility()),
		Status:      string(dto.Status()),
		FilePath:    filePath,
		FileSize:    dto.FileSize(),
		DurationMs:  dto.DurationMs(),
		MimeType:    mimeType,
	}
}

func FromDtoList(dtos []*applicationDto.Dto) []*Response {
	responses := make([]*Response, 0, len(dtos))
	for _, dto := range dtos {
		if dto != nil {
			responses = append(responses, FromDto(dto))
		}
	}
	return responses
}

func FromDtoPagination(
	dtos []*applicationDto.Dto,
	param response.PaginationParam,
) *PaginationResponse {
	return &PaginationResponse{
		Videos:     FromDtoList(dtos),
		Pagination: response.NewPaginationMeta(param),
	}
}

var _ response.FromDtoFunc[*applicationDto.Dto, *Response] = FromDto
var _ response.FromDtoListFunc[*applicationDto.Dto, *Response] = FromDtoList
var _ response.FromDtoPaginationFunc[*applicationDto.Dto, *PaginationResponse] = FromDtoPagination
