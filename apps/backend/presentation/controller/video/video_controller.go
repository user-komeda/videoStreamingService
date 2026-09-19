package video

import (
	usecaseVideo "videoStreaming/application/usecase/video"
	"videoStreaming/presentation/controller"
	videoReq "videoStreaming/presentation/request/video"
	"videoStreaming/presentation/response"
	videoRes "videoStreaming/presentation/response/video"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	getAllUC    *usecaseVideo.GetAllUseCase
	getDetailUC *usecaseVideo.GetDetailUseCase
	createUC    *usecaseVideo.CreateUseCase
	updateUC    *usecaseVideo.UpdateUseCase
	deleteUC    *usecaseVideo.DeleteUseCase
}

func NewController(
	getAllUC *usecaseVideo.GetAllUseCase,
	getDetailUC *usecaseVideo.GetDetailUseCase,
	createUC *usecaseVideo.CreateUseCase,
	updateUC *usecaseVideo.UpdateUseCase,
	deleteUC *usecaseVideo.DeleteUseCase,
) *Controller {
	return &Controller{
		getAllUC:    getAllUC,
		getDetailUC: getDetailUC,
		createUC:    createUC,
		updateUC:    updateUC,
		deleteUC:    deleteUC,
	}
}

// Index 一覧取得 (GET /videos)
//
//	@Summary		動画一覧取得
//	@Description	登録されている動画の一覧を取得します
//	@Tags			videos
//	@Accept			json
//	@Produce		json
//	@Success		200	{array}		videoRes.Response
//	@Failure		500	{object}	response.ErrorResponse
//	@Router			/videos [get]
func (c *Controller) Index(ctx *gin.Context) {
	videos, err := c.getAllUC.Invoke(ctx.Request.Context())
	if err != nil {
		response.HandleAppError(ctx, err)
		return
	}

	response.OK(ctx, videoRes.FromDtoList(videos))
}

// Show 単一取得 (GET /videos/:id)
//
//	@Summary		動画詳細取得
//	@Description	IDを指定して動画の詳細情報を取得します
//	@Tags			videos
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string	true	"Route ID"
//	@Success		200	{object}	videoRes.Response
//	@Failure		400	{object}	response.ErrorResponse
//	@Failure		404	{object}	response.ErrorResponse
//	@Failure		500	{object}	response.ErrorResponse
//	@Router			/videos/{id} [get]
func (c *Controller) Show(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		response.BadRequest(ctx, "id is required")
		return
	}

	videoDto, err := c.getDetailUC.Invoke(ctx.Request.Context(), id)
	if err != nil {
		response.HandleAppError(ctx, err)
		return
	}

	response.OK(ctx, videoRes.FromDto(videoDto))
}

// Create 新規作成 (POST /videos)
//
//	@Summary		動画新規作成
//	@Description	新しい動画のメタデータを作成します
//	@Tags			videos
//	@Accept			json
//	@Produce		json
//	@Param			request	body		videoReq.CreateVideoRequest	true	"Create Route Request"
//	@Success		201		{object}	videoRes.Response
//	@Failure		400		{object}	response.ErrorResponse
//	@Failure		409		{object}	response.ErrorResponse
//	@Failure		500		{object}	response.ErrorResponse
//	@Router			/videos [post]
func (c *Controller) Create(ctx *gin.Context) {
	var req videoReq.CreateVideoRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.BadRequest(ctx, "invalid request body", err.Error())
		return
	}

	dto, err := req.ToDto()
	if err != nil {
		response.BadRequest(ctx, "invalid request data", err.Error())
		return
	}

	createdDto, err := c.createUC.Invoke(ctx.Request.Context(), dto)
	if err != nil {
		response.HandleAppError(ctx, err)
		return
	}

	response.Created(ctx, videoRes.FromDto(createdDto))
}

// Update 更新 (PUT /videos/:id)
//
//	@Summary		動画更新
//	@Description	指定したIDの動画メタデータを更新します
//	@Tags			videos
//	@Accept			json
//	@Produce		json
//	@Param			id		path	string						true	"Route ID"
//	@Param			request	body	videoReq.UpdateVideoRequest	true	"Update Route Request"
//	@Success		204
//	@Failure		400	{object}	response.ErrorResponse
//	@Failure		404	{object}	response.ErrorResponse
//	@Failure		500	{object}	response.ErrorResponse
//	@Router			/videos/{id} [put]
func (c *Controller) Update(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		response.BadRequest(ctx, "id is required")
		return
	}

	var req videoReq.UpdateVideoRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.BadRequest(ctx, "invalid request body", err.Error())
		return
	}
	req.ID = id

	dto, err := req.ToDto()
	if err != nil {
		response.BadRequest(ctx, "invalid request data", err.Error())
		return
	}

	if updateErr := c.updateUC.Invoke(ctx.Request.Context(), dto); updateErr != nil {
		response.HandleAppError(ctx, updateErr)
		return
	}

	response.NoContent(ctx)
}

// Delete 削除 (DELETE /videos/:id)
//
//	@Summary		動画削除
//	@Description	指定したIDの動画を削除します
//	@Tags			videos
//	@Accept			json
//	@Produce		json
//	@Param			id	path	string	true	"Route ID"
//	@Success		204
//	@Failure		400	{object}	response.ErrorResponse
//	@Failure		404	{object}	response.ErrorResponse
//	@Failure		500	{object}	response.ErrorResponse
//	@Router			/videos/{id} [delete]
func (c *Controller) Delete(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		response.BadRequest(ctx, "id is required")
		return
	}

	if err := c.deleteUC.Invoke(ctx.Request.Context(), id); err != nil {
		response.HandleAppError(ctx, err)
		return
	}

	response.NoContent(ctx)
}

var _ controller.CRUD = (*Controller)(nil)
