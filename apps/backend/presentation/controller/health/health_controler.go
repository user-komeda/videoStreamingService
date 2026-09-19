package health

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Controller struct{}

func NewController() *Controller { return &Controller{} }

// Check ヘルスチェック (GET /health)
//
//	@Summary		ヘルスチェック
//	@Description	サーバーの稼働状態を確認します
//	@Tags			health
//	@Produce		json
//	@Success		200	{object}	map[string]string
//	@Router			/health [get]
func (c *Controller) Check(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
}
