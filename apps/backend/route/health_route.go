package route

import (
	"videoStreaming/presentation/controller/health"

	"github.com/gin-gonic/gin"
)

func RegisterHealth(r *gin.Engine, c *health.Controller) {
	r.GET("/health", c.Check)
}
