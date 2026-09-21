# ======== 1. Turborepo Prune ステージ ========
FROM ghcr.io/user-komeda/docker_node:sha-7b65646@sha256:50422fcfb8c922abcde11dac975ed4d570068438cdb916899010287e03de1b80 AS pruner
WORKDIR /app
COPY . .
RUN corepack enable && yarn dlx turbo prune --scope=backend --docker

# ======== 2. infisicalLauncher 取得ステージ ========
FROM ghcr.io/user-komeda/docker_node:sha-7b65646@sha256:50422fcfb8c922abcde11dac975ed4d570068438cdb916899010287e03de1b80 AS launcher-builder
WORKDIR /app
RUN microdnf install -y git openssh-clients && \
    microdnf clean all && \
    mkdir -p -m 0700 ~/.ssh && \
    ssh-keyscan -H github.com >> ~/.ssh/known_hosts
RUN corepack enable

# prune された package.json 群と yarn.lock を配置
COPY --from=pruner /app/out/json/ .
COPY .yarn ./.yarn

# 依存関係をインストール
RUN --mount=type=ssh yarn install --immutable

# ======== 3. Go ビルドステージ ========
FROM golang:1.27-alpine@sha256:4cb7ac979db5fcc41cae44b2227ba5ab8a51e8807f40d9ba4dee20a0ad960b5b AS go-builder
WORKDIR /app
RUN apk add --no-cache git
COPY /apps/backend/go.mod /apps/backend/go.sum ./
RUN go mod download
COPY /apps/backend/ .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o server .

# ======== 4. 実行ステージ ========
FROM ghcr.io/user-komeda/docker_node:sha-7b65646@sha256:50422fcfb8c922abcde11dac975ed4d570068438cdb916899010287e03de1b80 AS runner
WORKDIR /app

# Go バイナリ本体のみをコピー
COPY --from=go-builder /app/server .

# infisicalLauncher のバンドル成果物のみをコピー
COPY --from=launcher-builder /app/node_modules/infisicalLauncher/dist/index.cjs ./infisicalLauncher.cjs

RUN groupadd appgroup && useradd -r -g appgroup appuser
USER appuser

EXPOSE 8080

CMD ["node", "./infisicalLauncher.cjs", "--path=/videoStreaming/backend/", "--", "./server"]
