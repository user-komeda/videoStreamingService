
# ======== 1. Turborepo Prune ステージ ========
FROM ghcr.io/user-komeda/docker_node:sha-79897d5@sha256:e61f8ea86e1ca9c598bcec2163cdf0adeb0418b26deb08b637ef4d42bafe79a0 AS pruner
WORKDIR /app
ENV NODE_USE_ENV_PROXY=1
COPY . .
RUN corepack enable && yarn dlx turbo prune --scope=backend --docker

# ======== 2. infisicalLauncher 取得ステージ ========
FROM ghcr.io/user-komeda/docker_node:sha-79897d5@sha256:e61f8ea86e1ca9c598bcec2163cdf0adeb0418b26deb08b637ef4d42bafe79a0 AS launcher-builder
WORKDIR /app
ENV NODE_USE_ENV_PROXY=1
RUN microdnf install -y git openssh-clients && \
    microdnf clean all && \
    mkdir -p -m 0700 ~/.ssh && \
    ssh-keyscan -H github.com >> ~/.ssh/known_hosts
RUN corepack enable

COPY --from=pruner /app/out/json/ .
COPY .yarn ./.yarn

RUN --mount=type=ssh yarn install --immutable

# ======== 3. Go ビルドステージ ========
FROM golang:1.27-alpine@sha256:fa3d596898d9f126af7c01d14ee7597bab3f39cccf392ef36b69fe77cd681f18 AS go-builder
WORKDIR /app
RUN apk add --no-cache git
COPY /apps/backend/go.mod /apps/backend/go.sum ./
RUN go mod download
COPY /apps/backend/ .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o server .

# ======== 4. 実行ステージ ========
FROM ghcr.io/user-komeda/docker_node:sha-79897d5@sha256:e61f8ea86e1ca9c598bcec2163cdf0adeb0418b26deb08b637ef4d42bafe79a0 AS runner
WORKDIR /app
ENV NODE_USE_ENV_PROXY=1

COPY --from=go-builder /app/server .
COPY --from=launcher-builder /app/node_modules/infisicalLauncher/dist/index.cjs ./infisicalLauncher.cjs

USER 1001:1001

EXPOSE 8080

CMD ["node", "./infisicalLauncher.cjs", "--path=/videoStreaming/backend/", "--", "./server"]
