package auth

import authDto "videoStreaming/application/dto/auth"

type SignUpRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

func (r *SignUpRequest) ToDto() authDto.SignUpInput {
	return authDto.SignUpInput{
		Email:    r.Email,
		Password: r.Password,
	}
}

type SignInRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (r *SignInRequest) ToDto() authDto.SignInInput {
	return authDto.SignInInput{
		Email:    r.Email,
		Password: r.Password,
	}
}
