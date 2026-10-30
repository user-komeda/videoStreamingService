package auth

import (
	usecaseAuth "videoStreaming/application/usecase/auth"
	authReq "videoStreaming/presentation/request/auth"
	"videoStreaming/presentation/response"
	authRes "videoStreaming/presentation/response/auth"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	signUpUC usecaseAuth.SignUpUseCase
	signInUC usecaseAuth.SignInUseCase
}

func NewController(
	signUpUC usecaseAuth.SignUpUseCase,
	signInUC usecaseAuth.SignInUseCase,
) *Controller {
	return &Controller{
		signUpUC: signUpUC,
		signInUC: signInUC,
	}
}

// SignUp 新規ユーザー登録 (POST /auth/signup)
//
//	@Summary		サインアップ
//	@Description	新規ユーザーを登録し、認証トークンを発行します
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		authReq.SignUpRequest	true	"Sign Up Request"
//	@Success		201		{object}	authRes.Response
//	@Failure		400		{object}	response.ErrorResponse
//	@Failure		409		{object}	response.ErrorResponse
//	@Failure		500		{object}	response.ErrorResponse
//	@Router			/auth/signup [post]
func (c *Controller) SignUp(ctx *gin.Context) {
	var req authReq.SignUpRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.BadRequest(ctx, "invalid request body", err.Error())
		return
	}

	resultDto, err := c.signUpUC.Invoke(ctx.Request.Context(), req.ToDto())
	if err != nil {
		response.HandleAppError(ctx, err)
		return
	}

	response.Created(ctx, authRes.FromDto(resultDto))
}

// SignIn ユーザーログイン (POST /auth/signin)
//
//	@Summary		サインイン
//	@Description	ユーザー認証を行い、認証トークンを発行します
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		authReq.SignInRequest	true	"Sign In Request"
//	@Success		200		{object}	authRes.Response
//	@Failure		400		{object}	response.ErrorResponse
//	@Failure		401		{object}	response.ErrorResponse
//	@Failure		500		{object}	response.ErrorResponse
//	@Router			/auth/signin [post]
func (c *Controller) SignIn(ctx *gin.Context) {
	var req authReq.SignInRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.BadRequest(ctx, "invalid request body", err.Error())
		return
	}

	resultDto, err := c.signInUC.Invoke(ctx.Request.Context(), req.ToDto())
	if err != nil {
		response.HandleAppError(ctx, err)
		return
	}

	response.OK(ctx, authRes.FromDto(resultDto))
}
