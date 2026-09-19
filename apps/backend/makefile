# OS 判定
ifeq ($(OS),Windows_NT)
    BIN_EXT := .exe
    RM := powershell -NoProfile -Command "Remove-Item -Force -ErrorAction SilentlyContinue"
else
    SHELL := /bin/sh
    BIN_EXT :=
    RM := rm -f
endif

GOPATH_BIN := $(shell go env GOPATH)/bin

export GOLANGCI_LINT_CACHE ?= $(shell go env GOCACHE)/golangci-lint

GOLANGCI_LINT := $(GOPATH_BIN)/golangci-lint$(BIN_EXT)
GOLANGCI_LINT_VERSION := v2.13.2

ATLAS := $(GOPATH_BIN)/atlas$(BIN_EXT)
ATLAS_CONFIG := file://./db/atlas.hcl

# Infisical Launcher の定義 (ルートの node_modules を参照)
INFISICAL_LAUNCHER := node ../../node_modules/infisicalLauncher/dist/index.cjs --path=/videoStreaming/backend/local

.PHONY: prepare-lint prepare-migrate lint fmt migrate-diff migrate-apply clean-lint clean-migrate \
        dev test swagger migrate-hash

dev:
	$(INFISICAL_LAUNCHER) -- go run main.go

test:
	$(INFISICAL_LAUNCHER) -- go test -p=1 -count=1 -coverprofile=coverage.out ./...
	$(INFISICAL_LAUNCHER) -- go run github.com/vladopajic/go-test-coverage/v2@v2.19.0 --config=.testcoverage.yml

swagger:
	swag init -g app/gin.go -o ./gen/swagger

migrate-hash: prepare-migrate
	$(INFISICAL_LAUNCHER) -- $(ATLAS) migrate hash --env local --config $(ATLAS_CONFIG)

# ---- LINT / FMT 用 ----
prepare-lint: install-lint

install-lint:
ifeq ($(OS),Windows_NT)
	@echo "Installing golangci-lint $(GOLANGCI_LINT_VERSION) on Windows..."
	go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@$(GOLANGCI_LINT_VERSION)
else
	@echo "Installing golangci-lint $(GOLANGCI_LINT_VERSION) on Unix..."
	curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/$(GOLANGCI_LINT_VERSION)/install.sh \
	| sh -s -- -b $(GOPATH_BIN) $(GOLANGCI_LINT_VERSION)
endif

lint:
	$(GOLANGCI_LINT) run -c .golangci.yml

fmt:
	$(GOLANGCI_LINT) fmt

# ---- MIGRATION 用 ----
prepare-migrate: install-atlas

install-atlas:
ifeq ($(OS),Windows_NT)
	@echo "Installing atlas on Windows..."
	curl.exe -fsSL -o "$(ATLAS)" https://atlasbinaries.com/atlas/atlas-windows-amd64-latest.exe
else
	@echo "Installing atlas on Unix..."
	curl -sSf https://atlasgo.sh | sh -s -- -b $(GOPATH_BIN) -y
endif

migrate-diff: prepare-migrate
	$(INFISICAL_LAUNCHER) -- $(ATLAS) migrate diff --env local --config $(ATLAS_CONFIG)

migrate-apply: prepare-migrate
	$(INFISICAL_LAUNCHER) -- $(ATLAS) migrate apply --env local --config $(ATLAS_CONFIG)

clean-lint:
	$(RM) "$(GOLANGCI_LINT)"

clean-migrate:
	$(RM) "$(ATLAS)"