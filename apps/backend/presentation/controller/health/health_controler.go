package health

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Controller struct{}

func NewController() *Controller { return &Controller{} }

func (c *Controller) Check(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
}
