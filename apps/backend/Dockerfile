# ======== ビルドステージ ========
FROM golang:1.26-alpine@sha256:3ad57304ad93bbec8548a0437ad9e06a455660655d9af011d58b993f6f615648 AS builder

# 作業ディレクトリ
WORKDIR /app

# 必要なパッケージを追加（gitなど）
RUN apk add --no-cache git
# 依存キャッシュを効かせるために先に go.mod と go.sum をコピー
COPY /apps/backend/go.mod /apps/backend/go.sum ./
RUN go mod download

# ソースをコピー
COPY /apps/backend/ .

# 本番向けビルド（静的リンク、不要なシンボル削除）
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o server .

# ======== 実行ステージ ========
FROM alpine:3.24@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b AS runner

# 作業ディレクトリ
WORKDIR /app

# 必要なら証明書などを追加
RUN apk add --no-cache ca-certificates && update-ca-certificates

# ビルドしたバイナリをコピー
COPY --from=builder /app/server .

# ポートを開放
EXPOSE 8080

# 非rootユーザーで実行する場合（任意）
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# コンテナ起動時のコマンド
CMD ["./server"]