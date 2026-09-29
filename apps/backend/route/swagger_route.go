package route

import (
	"context"
	"io/fs"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files/v2"
	ginSwagger "github.com/swaggo/gin-swagger"
	"golang.org/x/net/webdav"
)

type swaggerFileSystem struct{}

func (swaggerFileSystem) Mkdir(context.Context, string, os.FileMode) error {
	return fs.ErrPermission
}

func (swaggerFileSystem) OpenFile(_ context.Context, name string, flag int, _ os.FileMode) (webdav.File, error) {
	if flag != os.O_RDONLY {
		return nil, fs.ErrPermission
	}
	name = strings.TrimPrefix(path.Clean("/"+name), "/")
	file, err := http.FS(swaggerFiles.FS).Open(name)
	if err != nil {
		return nil, err
	}
	return readOnlySwaggerFile{File: file}, nil
}

func (swaggerFileSystem) RemoveAll(context.Context, string) error {
	return fs.ErrPermission
}

func (swaggerFileSystem) Rename(context.Context, string, string) error {
	return fs.ErrPermission
}

func (swaggerFileSystem) Stat(context.Context, string) (os.FileInfo, error) {
	return nil, fs.ErrPermission
}

type readOnlySwaggerFile struct {
	http.File
}

func (readOnlySwaggerFile) Write([]byte) (int, error) {
	return 0, fs.ErrPermission
}

func RegisterSwagger(r *gin.Engine) {
	handler := &webdav.Handler{
		FileSystem: swaggerFileSystem{},
		LockSystem: webdav.NewMemLS(),
	}
	r.GET("/swagger/*any", ginSwagger.WrapHandler(handler))
}
