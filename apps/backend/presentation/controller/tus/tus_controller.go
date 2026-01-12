package tus

import (
	"net/http"
	"strings"

	"videoStreaming/config"
	libtus "videoStreaming/lib/tus"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	h    *libtus.Handler
	base string
}

func NewController(cfg config.TusConfig, h *libtus.Handler) *Controller {
	base := cfg.BasePath
	if !strings.HasPrefix(base, "/") {
		base = "/" + base
	}
	return &Controller{h: h, base: base}
}

func (c *Controller) Handle() gin.HandlerFunc {
	return gin.WrapH(http.StripPrefix(c.base, c.h))
}
