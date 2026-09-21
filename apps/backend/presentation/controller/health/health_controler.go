package health

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const (
	keyStatus   = "status"
	keyError    = "error"
	statusError = "error"
	pingTimeout = 2 * time.Second
)

type Controller struct {
	db *gorm.DB
}

func NewController(db *gorm.DB) *Controller {
	return &Controller{db: db}
}

// Check ヘルスチェック (GET /health)
//
//	@Summary		ヘルスチェック
//	@Description	サーバーの稼働状態およびDB接続状態を確認します
//	@Tags			health
//	@Produce		json
//	@Success		200	{object}	map[string]string
//	@Failure		503	{object}	map[string]string
//	@Router			/health [get]
func (c *Controller) Check(ctx *gin.Context) {
	if c.db == nil {
		ctx.JSON(http.StatusServiceUnavailable, gin.H{
			keyStatus: statusError,
			keyError:  "database client is not initialized",
		})
		return
	}

	sqlDB, err := c.db.DB()
	if err != nil {
		ctx.JSON(http.StatusServiceUnavailable, gin.H{
			keyStatus: statusError,
			keyError:  "failed to get database instance",
		})
		return
	}

	pingCtx, cancel := context.WithTimeout(ctx.Request.Context(), pingTimeout)
	defer cancel()

	if pingErr := sqlDB.PingContext(pingCtx); pingErr != nil {
		ctx.JSON(http.StatusServiceUnavailable, gin.H{
			keyStatus: statusError,
			keyError:  "database unreachable: " + pingErr.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		keyStatus: "ok",
		"db":      "connected",
	})
}
