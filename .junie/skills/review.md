---
name: review
description: Review git staged or recent changes against project architectural rules and best practices.
---

# Code Review Skill

現在の git 差分（staged または working tree）を対象に、変更内容の概要整理およびプロジェクトの設計規約・セキュリティ観点からコードレビューを実施します。

## レビュー観点・手順
1. **差分の確認**:
   - `git status` および `git diff` で変更差分を確認する。
2. **変更内容の概要出力**:
   - 対象ファイルの一覧と、各ファイルにおける主要な変更内容（Summary of Changes）を簡潔にまとめて出力する。
3. **バックエンド（Go）規約**:
   - レイヤードアーキテクチャ（`presentation` -> `application` -> `domain` <- `infrastructure`）の依存関係が守られているか。
   - 依存性注入に `Uber Fx` の規約が適切に適用されているか。
4. **フロントエンド（React / TypeScript）規約**:
   - React Router v8 のルート構成・コンポーネント配置規約に従っているか。
   - スキーマバリデーションに `Valibot` を使用しているか。
5. **セキュリティ & 品質**:
   - `yarn check` および `yarn secret-check` を実行してエラーや機密情報漏洩がないか検証する。
6. **フィードバックの出力**:
   - 発見された問題点、改善提案、および修正例をカテゴリ別に提示する。
