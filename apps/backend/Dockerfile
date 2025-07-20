# ======== ビルドステージ ========
FROM golang:1.24-alpine@sha256:daae04ebad0c21149979cd8e9db38f565ecefd8547cf4a591240dc1972cf1399 AS builder

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
FROM alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1 AS runner

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