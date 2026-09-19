---
name: swagger
description: Generate and update Swagger/OpenAPI documentation for the Go backend.
---

# Backend Swagger Generation

Go バックエンドのルートおよびコントローラーのアノテーションから OpenAPI / Swagger 仕様書を生成します。

## 実行手順
1. プロジェクトルートで `yarn swagger`（または `cd apps/backend; swag init -g app/gin.go -o ./gen/swagger`）を実行する。
2. 生成された `apps/backend/gen/swagger/` 配下のファイルに変更があるか確認し、コンパイルエラーがないかチェックする。
