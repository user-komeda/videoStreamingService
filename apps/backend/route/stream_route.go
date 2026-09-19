package route

import (
	"videoStreaming/presentation/controller/stream"

	"github.com/gin-gonic/gin"
)

func RegisterStream(r *gin.Engine, c *stream.Controller) {
	r.GET("/videos/:id/stream", c.Stream)
}
