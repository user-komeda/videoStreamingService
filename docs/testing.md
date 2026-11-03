# テスト方針・設計ガイドライン (Testing Guidelines)

本プロジェクト（`videoStreamingService`）におけるテストの全体戦略、各レイヤーの責務、実装規約、および品質基準を定義します。

---

## 1. 全体戦略と基本原則

本プロジェクトでは、**「カバレッジ 100% の維持」** と **「バグ検出力・リファクタリング耐性の高い振る舞い検証」** を両立させるため、以下の多層防御ピラミッドを採用します。

```
 ┌────────────────────────────────────────────────────────┐
 │ 1. E2E 層 (Playwright)                                  │
 │   - 最重要ユースケース（動画アップロード〜再生等）の保証 │
 ├────────────────────────────────────────────────────────┤
 │ 2. 結合テスト層 (Vitest + RTL + MSW / Go Integration)   │ ★ 画面・API連携の主軸
 │   - Route 画面全体の振る舞い・状態遷移・API 連携を検証 │
 ├────────────────────────────────────────────────────────┤
 │ 3. 単体・ロジック層 (Vitest / Go test)                  │ ★ エッジケース・ロジック
 │   - コンポーネント、カスタムフック、認可、バイナリ解析 │
 └────────────────────────────────────────────────────────┘
```

### コア原則
1. **カバレッジ 100% の維持**:
   - `apps/frontend/vite.config.ts` および `apps/backend/.testcoverage.yml` により、全ステートメント・ブランチのカバレッジ 100% を強制します。
2. **全レイヤー網羅（重複の許容）**:
   - 「どこまで単体テストを書くべきか」という属人的な迷いやテスト漏れを防ぐため、**コンポーネント・フックの全ファイルで単体テストを書き、さらに画面単位（Route）の結合テストも記述**します。
3. **形骸化アサーションの禁止（振る舞い駆動）**:
   - 単に行を通すためだけの `toBeDefined()` やアサーション無しのクリックテストを禁止し、**「ユーザー操作後の UI 変化」「状態変化」「コールバック発火」** を厳密に検証します。

---

## 2. フロントエンド（React / React Router v8）テスト規約

### ① レイヤー構成と責務
| レイヤー | 配置場所 | ツール | 主な検証内容 |
| :--- | :--- | :--- | :--- |
| **Route 結合テスト** | `app/routes/**/route.integration.test.tsx` | Vitest, RTL, MSW | 画面全体の初期描画、フォーム入力→送信→画面遷移、API 異常系（401/404/500）の表示 |
| **コンポーネント単体** | `src/feature/**/components/*.test.tsx` | Vitest, RTL, user-event | ダイアログ開閉、ボタン押下によるスタイル・ARIA属性変化、コールバック発火 |
| **カスタムフック / ロジック** | `src/feature/**/hooks/*.test.ts`, `formOptions.test.ts` | Vitest, renderHook | 複雑な状態遷移、タイマー制御、外部 SDK（Uppy/HLS）連動、Zod バリデーション |
| **E2E テスト** | `apps/frontend/e2e/*.spec.ts` | Playwright | 実バックエンド協調での動画アップロード・HLS 再生などの最重要シナリオ |

### ② フロントエンド実装ルール
- **イベント発火**: `fireEvent` ではなく `@testing-library/user-event`（`userEvent.setup()`）を標準とします。
- **要素クエリ**: DOM クラス名や内部構造ではなく、アクセシビリティクエリ（`getByRole`, `getByLabelText`, `getByText`）を使用します。
- **API モック**: 個別の `vi.mock()` や `global.fetch` 手動モックを廃止し、**MSW (Mock Service Worker)** でネットワーク層インターセプトを行います。

---

## 3. バックエンド（Go / Gin）テスト規約

### ① レイヤー構成と責務
| レイヤー | 配置場所 | ツール | 主な検証内容 |
| :--- | :--- | :--- | :--- |
| **認可・ミドルウェア** | `middleware/*_test.go` | net/http/httptest, Redis | JWT 署名検証、期限切れ、Redis ブラックリスト失効確認、スコープ分離 |
| **メディア処理・解析** | `application/usecase/upload/*_test.go` | httptest.Server | MP4 バイナリボックス組み立て、S3 Range リクエストによる先頭部分取得 |
| **データアクセス / DB** | `infrastructure/repository/*_test.go` | GORM, PostgreSQL | CRUD 整合性、Closed DB、DB 制約違反時のドメイン例外マッピング |
| **ユースケース / API** | `application/usecase/*_test.go`, `presentation/*_test.go` | インターフェースモック, Gin Context | ビジネス例外変換、HTTP ステータス（400/404/500）とレスポンス構造 |
| **統合テスト** | `test/integration/*_test.go` | Gin Engine, PostgreSQL | ルーティングから DB までのエンドツーエンド API 疎通 |

### ② バックエンド実装ルール
- DTO / レスポンスマッパーなどのフィールド詰め替えテストは、**テーブル駆動テスト（Table-Driven Tests）** を用いて整理し、高い保守性を保ちながら 100% カバレッジを維持します。

---

## 4. 品質検証コマンド (CI / ローカル)

```bash
# プロジェクト全体の検証 (Lint / Typecheck / Format / Tests / Lighthouse)
yarn check

# バックエンドのテスト実行（カバレッジ 100% 強制）
cd apps/backend && yarn test

# フロントエンドの単体・結合テスト実行（カバレッジ 100% 強制）
cd apps/frontend && yarn test

# E2E テスト実行 (Playwright)
cd apps/frontend && yarn test:e2e
```
