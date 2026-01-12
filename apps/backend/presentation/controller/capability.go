package controller

import "github.com/gin-gonic/gin"

type (
	Indexer interface{ Index(*gin.Context) }
	Shower  interface{ Show(*gin.Context) }
	Creator interface{ Create(*gin.Context) }
	Updater interface{ Update(*gin.Context) }
	Deleter interface{ Delete(*gin.Context) }
)
