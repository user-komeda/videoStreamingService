package auth

import authDto "videoStreaming/application/dto/auth"

type Response struct {
	UserID string `json:"user_id"`
}

func FromDto(dto *authDto.ResultDto) *Response {
	if dto == nil {
		return nil
	}
	return &Response{
		UserID: dto.UserID,
	}
}
