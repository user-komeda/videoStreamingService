package main

import (
	"videoStreaming/container"

	"go.uber.org/fx"
)

func main() {
	fx.New(container.App).Run()
}
