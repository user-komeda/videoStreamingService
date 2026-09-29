package route

import (
	"context"
	"errors"
	"io/fs"
	"os"
	"testing"
)

func TestSwaggerFileSystemRejectsMutations(t *testing.T) {
	fileSystem := swaggerFileSystem{}
	ctx := context.Background()

	tests := []struct {
		name string
		call func() error
	}{
		{
			name: "mkdir",
			call: func() error {
				return fileSystem.Mkdir(ctx, "new-dir", 0o755)
			},
		},
		{
			name: "remove",
			call: func() error {
				return fileSystem.RemoveAll(ctx, "index.html")
			},
		},
		{
			name: "rename",
			call: func() error {
				return fileSystem.Rename(ctx, "index.html", "new.html")
			},
		},
		{
			name: "stat",
			call: func() error {
				_, err := fileSystem.Stat(ctx, "index.html")
				return err
			},
		},
		{
			name: "write",
			call: func() error {
				_, err := (readOnlySwaggerFile{}).Write(nil)
				return err
			},
		},
		{
			name: "open for writing",
			call: func() error {
				_, err := fileSystem.OpenFile(ctx, "index.html", os.O_WRONLY, 0)
				return err
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if err := test.call(); !errors.Is(err, fs.ErrPermission) {
				t.Fatalf("expected permission error, got %v", err)
			}
		})
	}
}

func TestSwaggerFileSystemOpenFileNotFound(t *testing.T) {
	_, err := (swaggerFileSystem{}).OpenFile(context.Background(), "not-found", os.O_RDONLY, 0)
	if !errors.Is(err, fs.ErrNotExist) {
		t.Fatalf("expected file-not-found error, got %v", err)
	}
}
