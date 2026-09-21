---
name: dev-db
description: Start or stop local PostgreSQL database using Infisical and Docker Compose.
---

# Local Database Management

Infisical を通じて環境変数を注入し、ローカル開発用 PostgreSQL コンテナを管理します。

## コマンド一覧
- **データベースの起動**:
  ```powershell
  yarn compose-up
  ```
- **全コンテナ（Frontend + Backend + DB）の一括起動**:
  ```powershell
  yarn compose-up-all
  ```
- **コンテナの停止**:
  ```powershell
  yarn compose-down
  ```
- **ボリュームを含めた完全破棄**:
  ```powershell
  yarn compose-down-v
  ```
