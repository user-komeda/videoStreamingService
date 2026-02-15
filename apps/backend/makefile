SHELL := /bin/sh
GOPATH_BIN := $(shell go env GOPATH)/bin

GOLANGCI_LINT := $(GOPATH_BIN)/golangci-lint
GOLANGCI_LINT_VERSION := v2.9.0

ATLAS_CONFIG := file://./db/atlas.hcl


ATLAS := /usr/local/bin/atlas

.PHONY: prepare lint fmt migrate

prepare: $(GOLANGCI_LINT) $(ATLAS)

$(GOLANGCI_LINT):
	@echo "Installing golangci-lint $(GOLANGCI_LINT_VERSION)..."
	@rm -f $(GOLANGCI_LINT)
	curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/$(GOLANGCI_LINT_VERSION)/install.sh \
	| sh -s -- -b $(GOPATH_BIN) $(GOLANGCI_LINT_VERSION)

$(ATLAS):
	curl -sSf https://atlasgo.sh | sh -s -- -b  -y

fmt: prepare
	$(GOLANGCI_LINT) fmt

lint: prepare
	$(GOLANGCI_LINT) run -c .golangci.yml

migrate-diff: prepare
	$(ATLAS) migrate diff --env local --config $(ATLAS_CONFIG)

migrate-apply: prepare
	$(ATLAS) migrate apply --env local --config $(ATLAS_CONFIG)
