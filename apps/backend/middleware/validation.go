package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ValidateJSON[T any](validate func(T) error) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req T

		if err := ctx.ShouldBindJSON(&req); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
			return
		}
		if err := validate(req); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// validated 型を context に入れない（通過保証のみ）
		ctx.Next()
	}
}
