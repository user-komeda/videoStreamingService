# ======== ビルドステージ ========
FROM golang:1.26-alpine@sha256:d4c4845f5d60c6a974c6000ce58ae079328d03ab7f721a0734277e69905473e5 AS builder

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
FROM alpine:3.23@sha256:25109184c71bdad752c8312a8623239686a9a2071e8825f20acb8f2198c3f659 AS runner

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