package route

import (
	"videoStreaming/presentation/controller/auth"

	"github.com/gin-gonic/gin"
)

func RegisterAuth(r *gin.Engine, c *auth.Controller) {
	g := r.Group("/auth")
	{
		g.POST("/signup", c.SignUp)
		g.POST("/signin", c.SignIn)
	}
}
