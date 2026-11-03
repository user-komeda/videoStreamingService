---
name: test-guidelines
description: Follow the project testing strategy and guidelines for Frontend (React) and Backend (Go).
---

# Testing Strategy & Guidelines

本プロジェクトにおけるテストコード作成・修正時の規約です。

## 核心ルール
1. **カバレッジ 100% の維持**:
   - Frontend（Vitest）および Backend（Go）のテストカバレッジ 100% を必ず達成・維持すること。
2. **網羅性の担保（全レイヤー実装）**:
   - 「コンポーネント単体」「カスタムフック」「Route 結合テスト」「Backend 各層」のすべてにテストを作成すること。
3. **形骸化アサーションの禁止**:
   - `expect(el).toBeDefined()` などの単なる存在確認や、アサーションのないイベント発火を禁止する。
   - 必ず「UI の変化（クラス、表示文字、ダイアログ開閉）」「コールバックの呼び出し」「状態遷移」をアサートすること。

## Frontend 実装規約
- **イベント操作**: `fireEvent` ではなく `@testing-library/user-event` を使用する。
- **要素取得**: `getByRole`, `getByLabelText`, `getByText` などのユーザー視点クエリを使用する。
- **API モック**: `vi.mock` による手動 fetch モックを避け、MSW (Mock Service Worker) によるネットワーク層モックを使用する。
- **結合テスト**: `app/routes/**/route.integration.test.tsx` に `createMemoryRouter` + `QueryClientProvider` を用いた結合テストを配置する。

## Backend 実装規約
- **テーブル駆動テスト**: DTO やマッパー、複数ケースの検証には Table-Driven Tests を使用する。
- **認可・メディア処理**: JWT / Redis 失効 / MP4 バイナリボックス / S3 Range リクエストのエッジケースを網羅する。
- **エラーハンドリング**: ドメイン例外および DB エラーマッピング（400/404/500）の全分岐をテストする。

## 検証コマンド
- Monorepo 全体検証: `yarn check`
- Backend テスト: `cd apps/backend && yarn test`
- Frontend テスト: `cd apps/frontend && yarn test`
- E2E テスト: `cd apps/frontend && yarn test:e2e`
