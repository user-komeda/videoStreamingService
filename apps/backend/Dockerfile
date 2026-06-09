# ======== ビルドステージ ========
FROM golang:1.26-alpine@sha256:f23e8b227fb4493eabe03bede4d5a32d04092da71962f1fb79b5f7d1e6c2a17f AS builder

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
FROM alpine:3.23@sha256:5b10f432ef3da1b8d4c7eb6c487f2f5a8f096bc91145e68878dd4a5019afde11 AS runner

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