package route_test

import (
	"net/http"
	"testing"

	"videoStreaming/config"
	"videoStreaming/presentation/controller/health"
	"videoStreaming/presentation/controller/tus"
	"videoStreaming/presentation/controller/video"
	"videoStreaming/route"

	"github.com/gin-gonic/gin"
)

type mockIndexer struct{}

func (m *mockIndexer) Index(c *gin.Context) { c.Status(http.StatusOK) }

type mockShower struct{}

func (m *mockShower) Show(c *gin.Context) { c.Status(http.StatusOK) }

type mockCreator struct{}

func (m *mockCreator) Create(c *gin.Context) { c.Status(http.StatusCreated) }

type mockUpdater struct{}

func (m *mockUpdater) Update(c *gin.Context) { c.Status(http.StatusOK) }

type mockDeleter struct{}

func (m *mockDeleter) Delete(c *gin.Context) { c.Status(http.StatusOK) }

type allInOneController struct {
	mockIndexer
	mockShower
	mockCreator
	mockUpdater
	mockDeleter
}

func TestRegisterREST(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	dummyMiddleware := func(c *gin.Context) { c.Next() }
	ctrl := &allInOneController{}

	route.RegisterREST(r, "/test", ctrl, dummyMiddleware, dummyMiddleware)

	routes := r.Routes()
	if len(routes) < 5 {
		t.Errorf("expected at least 5 routes, got %d", len(routes))
	}
}

func TestRegisterHealth(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	c := health.NewController(nil)
	route.RegisterHealth(r, c)

	routes := r.Routes()
	if len(routes) == 0 {
		t.Fatal("expected health route to be registered")
	}
}

func TestRegisterTus(t *testing.T) {
	gin.SetMode(gin.TestMode)
	c := tus.NewController(config.TusConfig{
		BasePath: "/files/",
	}, nil)

	r1 := gin.New()
	route.RegisterTus(r1, config.TusConfig{
		BasePath: "/files/",
	}, c)
	if len(r1.Routes()) == 0 {
		t.Fatal("expected routes to be registered in r1")
	}

	r2 := gin.New()
	route.RegisterTus(r2, config.TusConfig{
		BasePath: "",
	}, c)
	if len(r2.Routes()) == 0 {
		t.Fatal("expected routes to be registered in r2")
	}
}

func TestRegisterSwagger(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	route.RegisterSwagger(r)

	routes := r.Routes()
	if len(routes) == 0 {
		t.Fatal("expected swagger route to be registered")
	}
}

func TestRegisterVideo(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	c := video.NewController(nil, nil, nil, nil, nil)
	route.RegisterVideo(r, c)

	routes := r.Routes()
	if len(routes) < 5 {
		t.Errorf("expected at least 5 routes registered, got %d", len(routes))
	}
}

func TestRegisterStream(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	route.RegisterStream(r, nil)

	routes := r.Routes()
	if len(routes) == 0 {
		t.Errorf("expected stream route to be registered")
	}
}
