---
name: e2e
description: Run Playwright E2E tests for frontend application.
---

# E2E Test Execution

Playwright を用いてフロントエンドおよび結合環境の E2E テストを実行します。

## 前提条件
- Docker コンテナ（DB、MinIO、Redis等）が起動していること (`yarn compose:up` または `yarn compose:upAll`)
- Playwright のブラウザバイナリがインストールされていること (`cd apps/frontend; yarn playwright install`)

## 実行手順
1. フロントエンドの全 E2E テストを実行する場合:
   - `cd apps/frontend; yarn test:e2e` を実行する。
2. 特定のテストファイルのみを実行する場合:
   - `cd apps/frontend; yarn playwright test e2e/home.spec.ts` を実行する。
3. UI モードでテストを実行する場合:
   - `cd apps/frontend; yarn test:e2e:ui` を実行する。
4. テスト結果レポートを確認する場合:
   - `cd apps/frontend; yarn playwright show-report` を実行する。
