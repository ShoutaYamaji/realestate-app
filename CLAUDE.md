# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code へのガイドです。

## プロジェクト概要

不動産アプリ（realestate-app）。Supabase 認証付きの不動産管理 Web アプリ。
メールアドレス＋パスワードで会員登録・ログインし、ログイン後に自分の物件を一覧・登録・編集・削除できる。

## 技術スタック

- React + Vite（JavaScript）
- React Router（画面遷移・認証ガード）
- Supabase（`@supabase/supabase-js`、認証と `properties` テーブルの CRUD）
- oxlint（Lint）

## よく使うコマンド

- 依存関係のインストール: `npm install`
- 開発サーバー起動: `npm run dev`
- ビルド: `npm run build`
- Lint: `npm run lint`
- テスト: 未設定

## 環境変数

Supabase の接続情報は `.env` で管理する（`.gitignore` 済み・コミット禁止）。テンプレートは `.env.example`。

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## デプロイ

- Vercel にデプロイする。`vercel.json` で全パスを `index.html` にリライトし、React Router の画面を直接開いたりリロードしたりしても 404 にならないようにしている。
- 環境変数（`VITE_SUPABASE_URL` など）は Vercel ダッシュボードで設定する。`vercel.json` には含めない。

## ディレクトリ構成

- `supabase/migrations/` — テーブル作成・RLS ポリシーの SQL（Supabase の SQL Editor で手動実行する）
- `src/lib/supabaseClient.js` — Supabase クライアント
- `src/lib/propertiesApi.js` — `properties` テーブルの CRUD 関数
- `src/contexts/` — 認証状態（セッション）を提供する AuthProvider
- `src/hooks/useAuth.js` — 認証状態を取得するフック
- `src/components/` — ProtectedRoute（要ログイン）/ PublicRoute（未ログイン専用）/ PropertyForm（物件の登録・編集フォーム）
- `src/pages/` — ログイン・会員登録・物件一覧の各画面

## データベース

- `properties` テーブル：物件名 `name`・家賃 `rent`（円）・エリア名 `area`・間取り `layout`・登録者 `user_id`
- `user_id` は DB の既定値 `auth.uid()` で自動設定されるため、React 側からは送らない。
- RLS 有効。自分が登録した物件のみ表示・登録・編集・削除できる。
- スキーマを変更する場合は `supabase/migrations/` に連番の SQL ファイルを追加する。

## Git 運用ルール

**コードを変更するたびに、コミットして GitHub にプッシュすること。**

1. 変更が一区切りついたら（1つの機能追加・修正・リファクタ単位で）すぐにコミットする。
2. コミット前にテストと Lint が通ることを確認する（設定済みの場合）。失敗した状態ではプッシュしない。
3. コミット後は必ず `git push` で GitHub（`origin`）へプッシュする。
4. プッシュに失敗した場合（リモートが先行している等）は `git pull --rebase` で取り込んでから再度プッシュする。`--force` での強制プッシュは行わない。
5. コミットメッセージは日本語で、変更内容が分かるように簡潔に書く。
   - 例: `物件一覧ページに価格フィルターを追加`
6. 以下はコミットしない。必要に応じて `.gitignore` に追加する。
   - `.env` などの秘密情報・APIキー
   - `node_modules/`、ビルド成果物、ログファイル
7. 変更内容とプッシュ結果（成功／失敗）を作業完了時に報告する。

## コーディング規約

- コメントは日本語で記載する。
- コンポーネントは関数コンポーネント＋名前付きエクスポートで書く（`App.jsx` のみ default export）。
