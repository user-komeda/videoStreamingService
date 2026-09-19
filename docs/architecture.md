# Architecture & Project Structure

## Project Structure
This is a video streaming service monorepo managed with TurboRepo and Yarn Workspaces.

### Apps Overview
- **`apps/backend`**: Go backend using [Uber Fx](https://github.com/uber-go/fx) for dependency injection.
  - `app`: Application entry point and server setup (`Gin` engine configuration).
  - `application`: Use cases and application logic (`application/usecase`, `application/dto`).
  - `domain`: Domain entities and repository interfaces (`domain/entity`, `domain/repository`).
  - `infrastructure`: Concrete implementations of repositories and external services (e.g., MinIO / S3, PostgreSQL / GORM / pgx).
  - `presentation`: Controllers, HTTP handlers, request validation, and response DTOs (`presentation/controller`, `presentation/request`, `presentation/response`).
  - `route`: Routing definitions (`route/`).
  - `gen/swagger`: Generated OpenAPI / Swagger files (`docs.go`, `swagger.json`, `swagger.yaml`).
  - `lib/tus`: TUS (resumable upload) integration via `tusd`.

- **`apps/frontend`**: Frontend built with [React Router](https://reactrouter.com/) (v8) and [Vite](https://vitejs.dev/).
  - `app/`: React Router ルーティング・レイアウト層
    - `root.tsx`: ルートコンポーネント（`QueryClientProvider`, ルート HTML/メタ情報, `RootErrorBoundary`）
    - `routes.ts`: ルート定義（React Router v8 ルーティング設定）
    - `routes/`: 各パスに対応するルートモジュール（ページのエントリーポイント・`loader`/`action`）
    - `layout/`: ルート共通レイアウト
  - `src/`: アプリケーション実装層
    - `api/`: API クライアントおよび自動生成コード
      - `client.ts`: Orval 向けの共通カスタム fetch クライアント
      - `generated/`: Orval によって OpenAPI 仕様から自動生成された API エンドポイント（`endpoints/`）、モデル型（`models/`）、バリデーションスキーマ（`zod/`）
    - `feature/`: 機能（ドメイン/関心事）ごとにカプセル化されたフィーチャーディレクトリ（`home`, `video`, `upload` など）
      - `[feature]/components/`: 機能固有の UI コンポーネント
      - `[feature]/hooks/`: 機能固有のカスタムフック・ロジック
      - `[feature]/queries.ts`: Orval の fetch 関数をラップした TanStack Query の `queryOptions` 定義
      - `[feature]/formOptions.ts`: TanStack Form 用のフォーム設定・バリデーション定義
      - `[feature]/data/`: モックデータ・定数定義
      - `[feature]/types/`: 機能固有の型定義
    - `components/`: アプリケーション共通の UI コンポーネント
      - `ui/`: shadcn / Base UI ベースの共通プリミティブコンポーネント（Button, Dialog, Card 等）
      - `header/`, `sidebar/`, `common/`: アプリケーション共通レイアウト部品・エラー境界
    - `lib/`: 汎用ユーティリティ関数（フォーマッタ `format.ts`、クラス名結合 `utils.ts` など）

## Coding Guidelines

### Backend (Go)
- Use `fx` for dependency injection (`container/` module definitions).
- Follow the established layered architecture:
  `presentation` ➔ `application` ➔ `domain` 🢠 `infrastructure`
- Code formatting and linting via `golangci-lint` (configured in `apps/backend/.golangci.yml`).
- Generate Swagger specifications using `swag` (output to `gen/swagger`).

### Frontend (TypeScript / React)
- **ルーティング・レイアウト設計（React Router v8）**:
  - `app/` 配下はルーティングとルーティング固有のデータローディング（`loader` / `action`）の責務のみを持ち、UI 実装本体は `src/feature/` 配下に委譲する。
- **フィーチャーベース構成（Feature-based Architecture）**:
  - ページや機能に関わるコンポーネント・フック・クエリ・型は `src/feature/[feature名]/` 配下に集約して関心事をカプセル化する。
- **データフェッチ・API クライアント設計（Orval & TanStack Query v5）**:
  - **Orval（コード生成）**: 純粋な fetch 関数（`client: 'fetch'`）と TypeScript 型定義、Zod スキーマを OpenAPI から自動生成する（カスタムフックは生成しない）。
  - **TanStack Query 統合**: 生成された fetch 関数を各フィーチャーの `queries.ts` 内で `queryOptions()` にラップして公開する。
  - **Suspense / Loader 連携**: React Router の `loader` でのプリフェッチや、コンポーネント内での `useSuspenseQuery(queryOptions)` / `useQuery(queryOptions)` によりデータ取得を行う。
- **フォーム & バリデーション設計**:
  - フォーム状態管理には `@tanstack/react-form` を用い、スキーマバリデーションには `zod` を使用する。
- **動画配信・アップロード設計**:
  - **ストリーミング再生**: HLS ストリーミング再生には `hls.js` を利用し、`useHls` フック経由で制御する。
  - **再開可能アップロード**: バックエンドの TUS サーバーと連携し、`@uppy/core` および `@uppy/tus` を利用したチャンクアップロードを行う。
- **コードスタイル & 品質**:
  - Prettier および ESLint（Flat Config）による静的解析・フォーマット。
