---
name: check
description: Run typecheck, linting, formatting, and secret-leak checks across the monorepo.
---

# Monorepo Code Quality & Security Check

モノレポ全体の静的解析（Lint、フォーマット、型チェック）およびシークレット漏洩チェックを実行します。

## 実行手順
1. プロジェクトルートで `yarn check` を実行し、全パッケージの型チェック、ESLint、Prettier の検証を行う。
2. `yarn secret-check`を実行し、コミット前のシークレット漏洩がないか検証する。
3. エラーまたは警告が検出された場合は、原因を特定して修正を行い、再度検証コマンドを実行する。
