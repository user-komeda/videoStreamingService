---
name: test
description: Run backend (Go) and frontend (Vitest) unit/integration tests.
---

# Test Suite Execution

バックエンドおよびフロントエンドのテストを実行します。

## 実行手順
1. モノレポ全体のテストを実行する場合:
   - `yarn test` を実行する。
2. バックエンドのみをテストする場合:
   - `cd apps/backend; yarn test` を実行する。
3. フロントエンドのみをテストする場合:
   - `cd apps/frontend; yarn test` を実行する。
