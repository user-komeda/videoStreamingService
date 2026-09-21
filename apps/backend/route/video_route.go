package route

import (
	"videoStreaming/presentation/controller/video"

	"github.com/gin-gonic/gin"
)

func RegisterVideo(r *gin.Engine, c *video.Controller) {
	r.GET("/videos", c.Index)
	r.GET("/videos/:id", c.Show)
	r.POST("/videos", c.Create)
	r.PUT("/videos/:id", c.Update)
	r.DELETE("/videos/:id", c.Delete)
}
