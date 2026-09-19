package app

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"videoStreaming/config"
)

// @title Route Streaming API.
// @version 1.0.
// @description Route Streaming Service Backend API.

// NewGinEngine initializes and configures a new Gin engine.
func NewGinEngine(cfg config.Config) *gin.Engine {
	r := gin.Default()
	r.RedirectTrailingSlash = false

	corsCfg := cors.Config{
		AllowHeaders: []string{
			"Origin", "Content-Type", "Authorization",
			"Tus-Resumable", "Tus-Version", "Tus-Extension", "Tus-Max-Size",
			"Upload-Length", "Upload-Offset", "Upload-Metadata", "Upload-Defer-Length", "Upload-Concat",
		},
		ExposeHeaders: []string{
			"Location", "Tus-Resumable", "Tus-Version", "Tus-Extension", "Tus-Max-Size",
			"Upload-Length", "Upload-Offset", "Upload-Metadata", "Upload-Defer-Length", "Upload-Concat",
		},
		AllowMethods: []string{"GET", "POST", "PATCH", "HEAD", "OPTIONS", "PUT", "DELETE"},
	}

	if len(cfg.CORSAllowedOrigins) > 0 {
		corsCfg.AllowOrigins = cfg.CORSAllowedOrigins
	} else {
		corsCfg.AllowAllOrigins = true
	}

	r.Use(cors.New(corsCfg))

	return r
}
