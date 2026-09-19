package response

import (
	"errors"
	"net/http"

	appErrors "videoStreaming/application/errors"

	"github.com/gin-gonic/gin"
)

func OK(ctx *gin.Context, data any) {
	ctx.JSON(http.StatusOK, data)
}

func Created(ctx *gin.Context, data any) {
	ctx.JSON(http.StatusCreated, data)
}

func NoContent(ctx *gin.Context) {
	ctx.Status(http.StatusNoContent)
}

func BadRequest(ctx *gin.Context, message string, details ...string) {
	ctx.JSON(http.StatusBadRequest, NewErrorResponse(message, details...))
}

func Unauthorized(ctx *gin.Context, message string, details ...string) {
	ctx.JSON(http.StatusUnauthorized, NewErrorResponse(message, details...))
}

func Forbidden(ctx *gin.Context, message string, details ...string) {
	ctx.JSON(http.StatusForbidden, NewErrorResponse(message, details...))
}

func NotFound(ctx *gin.Context, message string, details ...string) {
	ctx.JSON(http.StatusNotFound, NewErrorResponse(message, details...))
}

func Conflict(ctx *gin.Context, message string, details ...string) {
	ctx.JSON(http.StatusConflict, NewErrorResponse(message, details...))
}

func InternalServerError(ctx *gin.Context, message string, details ...string) {
	ctx.JSON(http.StatusInternalServerError, NewErrorResponse(message, details...))
}

type errorHandlerFunc func(ctx *gin.Context, message string, details ...string)

func getErrorHandler(code appErrors.ErrorCode) errorHandlerFunc {
	switch code {
	case appErrors.CodeInvalidArgument:
		return BadRequest
	case appErrors.CodeUnauthorized:
		return Unauthorized
	case appErrors.CodeForbidden:
		return Forbidden
	case appErrors.CodeNotFound:
		return NotFound
	case appErrors.CodeConflict:
		return Conflict
	case appErrors.CodeInternal:
		return InternalServerError
	default:
		return InternalServerError
	}
}

func HandleAppError(ctx *gin.Context, err error) {
	if appErr, ok := errors.AsType[*appErrors.AppError](err); ok {
		var details []string
		if appErr.Err != nil {
			details = []string{appErr.Err.Error()}
		}

		handler := getErrorHandler(appErr.Code)
		handler(ctx, appErr.Message, details...)
		return
	}

	InternalServerError(ctx, "internal server error", err.Error())
}
