package route

import (
	"videoStreaming/presentation/controller"

	"github.com/gin-gonic/gin"
)

func RegisterREST(
	r *gin.Engine,
	base string,
	c any,
	create gin.HandlerFunc,
	update gin.HandlerFunc,
) {
	if v, ok := c.(controller.Indexer); ok {
		r.GET(base, v.Index)
	}
	if v, ok := c.(controller.Shower); ok {
		r.GET(base+"/:id", v.Show)
	}
	if v, ok := c.(controller.Creator); ok {
		r.POST(base, create, v.Create)
	}
	if v, ok := c.(controller.Updater); ok {
		r.PUT(base+"/:id", update, v.Update)
	}
	if v, ok := c.(controller.Deleter); ok {
		r.DELETE(base+"/:id", v.Delete)
	}
}
