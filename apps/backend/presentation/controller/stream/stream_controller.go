package stream

import (
	"io"
	"strconv"

	streamUC "videoStreaming/application/usecase/stream"
	"videoStreaming/presentation/response"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	streamUC *streamUC.UseCase
}

func NewController(streamUC *streamUC.UseCase) *Controller {
	return &Controller{
		streamUC: streamUC,
	}
}

// Stream 動画ストリーミング (GET /videos/:id/stream)
//
//	@Summary		動画ストリーミング配信
//	@Description	指定したIDの動画をHTTP Range対応ストリーミング配信します
//	@Tags			stream
//	@Produce		video/mp4
//	@Param			id		path		string	true	"Video ID"
//	@Param			Range	header		string	false	"Range Header"
//	@Success		200		{file}		binary
//	@Success		206		{file}		binary
//	@Failure		400		{object}	response.ErrorResponse
//	@Failure		404		{object}	response.ErrorResponse
//	@Failure		500		{object}	response.ErrorResponse
//	@Router			/videos/{id}/stream [get]
func (c *Controller) Stream(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		response.BadRequest(ctx, "id is required")
		return
	}

	rangeHeader := ctx.GetHeader("Range")
	out, err := c.streamUC.Invoke(ctx.Request.Context(), id, rangeHeader)
	if err != nil {
		response.HandleAppError(ctx, err)
		return
	}
	defer out.Body.Close()

	if out.AcceptRanges != "" {
		ctx.Header("Accept-Ranges", out.AcceptRanges)
	}
	if out.ContentType != "" {
		ctx.Header("Content-Type", out.ContentType)
	}
	if out.ContentLength > 0 {
		ctx.Header("Content-Length", strconv.FormatInt(out.ContentLength, 10))
	}
	if out.ContentRange != "" {
		ctx.Header("Content-Range", out.ContentRange)
	}

	ctx.Status(out.StatusCode)
	_, _ = io.Copy(ctx.Writer, out.Body)
}
