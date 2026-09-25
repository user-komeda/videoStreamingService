# OS 判定
ifeq ($(OS),Windows_NT)
    BIN_DIR := .bin
    BIN_EXT := .exe
    RM := powershell -NoProfile -Command "Remove-Item -Force -Recurse -ErrorAction SilentlyContinue"
    MKDIR := powershell -NoProfile -Command "New-Item -ItemType Directory -Force -Path $(BIN_DIR)"
    DEV_NULL := NUL
    COMPOSE_FILES := -f docker-compose.yml
else
    SHELL := /bin/sh
    BIN_DIR := .bin
    BIN_EXT :=
    RM := rm -rf
    MKDIR := mkdir -p $(BIN_DIR)
    DEV_NULL := /dev/null
    COMPOSE_FILES := -f docker-compose.yml
endif

BETTERLEAKS := $(BIN_DIR)/betterleaks$(BIN_EXT)
BETTERLEAKS_VERSION := 1.8.1

INFISICAL_LAUNCHER := node ./node_modules/infisicalLauncher/dist/index.cjs

.PHONY: prepare-betterleaks install-betterleaks secret-check secret-check-staged clean-betterleaks \
        check-docker check-infisical prepare-compose \
        compose-up compose-up-all compose-down compose-down-v

# ---- Betterleaks (Secret Check) ----
prepare-betterleaks:
ifeq ($(OS),Windows_NT)
	@if not exist "$(BETTERLEAKS)" $(MAKE) install-betterleaks
else
	@if [ ! -f "$(BETTERLEAKS)" ]; then $(MAKE) install-betterleaks; fi
endif

install-betterleaks:
ifeq ($(OS),Windows_NT)
	@echo "Installing Betterleaks v$(BETTERLEAKS_VERSION) on Windows..."
	$(MKDIR)
	powershell -NoProfile -Command "\
		$$url = 'https://github.com/betterleaks/betterleaks/releases/download/v$(BETTERLEAKS_VERSION)/betterleaks_$(BETTERLEAKS_VERSION)_windows_x64.zip'; \
		$$zip = '$(BIN_DIR)/betterleaks.zip'; \
		Invoke-WebRequest -Uri $$url -OutFile $$zip; \
		Expand-Archive -Path $$zip -DestinationPath '$(BIN_DIR)' -Force; \
		Remove-Item $$zip -Force"
else
	@echo "Installing Betterleaks v$(BETTERLEAKS_VERSION) on Unix..."
	$(MKDIR)
	@OS_NAME=$$(uname -s | tr '[:upper:]' '[:lower:]'); \
	ARCH=$$(uname -m); \
	if [ "$$ARCH" = "x86_64" ]; then ARCH="x64"; elif [ "$$ARCH" = "aarch64" ] || [ "$$ARCH" = "arm64" ]; then ARCH="arm64"; fi; \
	URL="https://github.com/betterleaks/betterleaks/releases/download/v$(BETTERLEAKS_VERSION)/betterleaks_$(BETTERLEAKS_VERSION)_$${OS_NAME}_$${ARCH}.tar.gz"; \
	curl -sSfL "$$URL" | tar -xz -C $(BIN_DIR) betterleaks
	@chmod +x $(BETTERLEAKS)
endif

secret-check: prepare-betterleaks
	$(BETTERLEAKS) git -v .

secret-check-staged: prepare-betterleaks
	$(BETTERLEAKS) git --staged -v .

clean-betterleaks:
	$(RM) "$(BIN_DIR)"

# ---- Docker / Infisical Checks ----
check-docker:
	@docker --version > $(DEV_NULL) 2>&1 || (echo "Error: docker CLI is not installed." && exit 1)
	@docker compose version > $(DEV_NULL) 2>&1 || (echo "Error: docker compose is not available." && exit 1)
	@docker info > $(DEV_NULL) 2>&1 || (echo "Error: Docker daemon is not running." && exit 1)

check-infisical:
ifeq ($(OS),Windows_NT)
	@if not exist "node_modules\infisicalLauncher\dist\index.cjs" ( \
		echo "infisicalLauncher not found. Running yarn..." && yarn --immutable \
	)
else
	@if [ ! -f "node_modules/infisicalLauncher/dist/index.cjs" ]; then \
		echo "infisicalLauncher not found. Running yarn..." && yarn --immutable; \
	fi
endif

prepare-compose: check-docker check-infisical

# ---- Docker Compose Targets ----
compose-up: prepare-compose
	$(INFISICAL_LAUNCHER) --path=/videoStreaming/container/local -- docker compose $(COMPOSE_FILES) up -d

compose-up-all: prepare-compose
	$(INFISICAL_LAUNCHER) --path=/videoStreaming/container/local -- docker compose $(COMPOSE_FILES) --profile frontend --profile backend up -d --build

compose-down: check-docker
	$(INFISICAL_LAUNCHER) --path=/videoStreaming/container/local -- docker compose $(COMPOSE_FILES) --profile frontend --profile backend down

compose-down-v: check-docker
	$(INFISICAL_LAUNCHER) --path=/videoStreaming/container/local -- docker compose $(COMPOSE_FILES) --profile frontend --profile backend down -v
