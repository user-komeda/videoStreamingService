package tus

import (
	"videoStreaming/config"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	tusd "github.com/tus/tusd/v2/pkg/handler"
	"github.com/tus/tusd/v2/pkg/s3store"
)

type Handler struct {
	*tusd.Handler
}

func NewHandler(cfg config.TusConfig, s3Client *s3.Client, bucket string) (*Handler, error) {
	store := s3store.New(bucket, s3Client)

	composer := tusd.NewStoreComposer()
	store.UseIn(composer)

	h, err := tusd.NewHandler(tusd.Config{
		BasePath:              cfg.BasePath,
		StoreComposer:         composer,
		NotifyCompleteUploads: true,
	})
	if err != nil {
		return nil, err
	}

	return &Handler{Handler: h}, nil
}
