SHELL := /bin/sh

GOPATH_BIN := $(shell go env GOPATH)/bin

GOLANGCI_LINT := $(GOPATH_BIN)/golangci-lint
GOLANGCI_LINT_VERSION := v2.9.0

ATLAS := $(GOPATH_BIN)/atlas
ATLAS_CONFIG := file://./db/atlas.hcl

.PHONY: prepare-lint prepare-migrate lint fmt migrate-diff migrate-apply

# ---- LINT 用 ----
prepare-lint:clean-lint install-lint

install-lint:
	@echo "Installing golangci-lint..."
	curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/$(GOLANGCI_LINT_VERSION)/install.sh \
	| sh -s -- -b $(GOPATH_BIN) $(GOLANGCI_LINT_VERSION)

lint: prepare-lint
	$(GOLANGCI_LINT) run -c .golangci.yml

fmt: prepare-lint
	$(GOLANGCI_LINT) fmt

# ---- MIGRATION 用 ----
prepare-migrate: clean-migrate install-atlas

install-atlas:
	@echo "Installing atlas..."
	curl -sSf https://atlasgo.sh | sh -s -- -b $(GOPATH_BIN) -y

migrate-diff: prepare-migrate
	$(ATLAS) migrate diff --env local --config $(ATLAS_CONFIG)

migrate-apply: prepare-migrate
	$(ATLAS) migrate apply --env local --config $(ATLAS_CONFIG)

clean-lint:
	rm -f $(GOLANGCI_LINT)
clean-migrate:
	rm -f $(ATLAS)
