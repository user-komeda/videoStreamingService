package route

import (
	"strings"

	"videoStreaming/config"
	"videoStreaming/presentation/controller/tus"

	"github.com/gin-gonic/gin"
)

func RegisterTus(r *gin.Engine, cfg config.TusConfig, c *tus.Controller) {
	base := strings.TrimSuffix(cfg.BasePath, "/") // "/files"
	if base == "" {
		base = "/files"
	}

	r.POST(base+"/", c.Handle())
	r.PATCH(base+"/:id", c.Handle())
	r.GET(base+"/:id", c.Handle())
	r.HEAD(base+"/:id", c.Handle())
}
