package app

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewGinEngine() *gin.Engine {
	r := gin.Default()
	r.RedirectTrailingSlash = false

	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowHeaders: []string{
			"Origin", "Content-Type", "Authorization",
			"Tus-Resumable", "Upload-Length", "Upload-Offset", "Upload-Metadata",
		},
		AllowMethods: []string{"GET", "POST", "PATCH", "HEAD", "OPTIONS", "PUT", "DELETE"},
	}))

	return r
}
