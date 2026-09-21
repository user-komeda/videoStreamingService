package container_test

import (
	"testing"

	"videoStreaming/container"

	"go.uber.org/fx"
	"go.uber.org/fx/fxtest"
)

func TestNewLogger(t *testing.T) {
	logger := container.NewLogger()
	if logger == nil {
		t.Fatal("expected non-nil logger")
	}
}

func TestModules(t *testing.T) {
	if container.CoreModule() == nil {
		t.Fatal("expected non-nil CoreModule")
	}
	if container.LibModule() == nil {
		t.Fatal("expected non-nil LibModule")
	}
	if container.RepositoryModule() == nil {
		t.Fatal("expected non-nil RepositoryModule")
	}
	if container.ApplicationModule() == nil {
		t.Fatal("expected non-nil ApplicationModule")
	}
	if container.PresentationModule() == nil {
		t.Fatal("expected non-nil PresentationModule")
	}
	if container.App() == nil {
		t.Fatal("expected non-nil App")
	}
}

func TestAppGraph(t *testing.T) {
	app := fxtest.New(
		t,
		container.App(),
		fx.NopLogger,
	)
	if err := app.Err(); err != nil {
		t.Fatalf("failed to build app graph: %v", err)
	}
}
