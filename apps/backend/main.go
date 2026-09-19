package main

import (
	"videoStreaming/container"
	_ "videoStreaming/gen/swagger"

	"go.uber.org/fx"
)

func main() {
	fx.New(container.App()).Run()
}
