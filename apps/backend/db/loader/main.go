package main

import (
	"fmt"
	"io"
	"os"

	uploadEntity "videoStreaming/infrastructure/entity/upload"
	videoEntity "videoStreaming/infrastructure/entity/video"

	"ariga.io/atlas-provider-gorm/gormschema"
)

func main() {
	stmts, err := gormschema.New("postgres").Load(
		&uploadEntity.Entity{},
		&videoEntity.Entity{},
	)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to load gorm schema: %v\n", err)
		os.Exit(1)
	}
	if _, writeErr := io.WriteString(os.Stdout, stmts); writeErr != nil {
		fmt.Fprintf(os.Stderr, "failed to write gorm schema: %v\n", writeErr)
		os.Exit(1)
	}
}
