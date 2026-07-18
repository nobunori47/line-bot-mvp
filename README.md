# 美容室向け LINE Bot + AI 自動応答システム

美容室のお客さまから届く LINE メッセージに AI が自動で回答するシステムです。回答に自信がない場合はオーナーに通知し、管理画面から FAQ・メニュー・お知らせを管理できます。

[ダッシュボード画面]
<img width="2940" height="1520" alt="5CD8380F-5932-45DA-A7FA-D54CA69AAEC7" src="https://github.com/user-attachments/assets/40a37596-f24d-41a6-80c4-4ad2d8367100" />


## 主な機能

| 機能 | 説明 |
|---|---|
| FAQ 自動応答 | 登録済み FAQ をもとに AI がお客さまの質問へ自動返答 |
| エスカレーション通知 | AI の確信度が低い場合（スコア 4 以下）、オーナーの LINE に通知 |
| 管理画面（FAQ CRUD） | FAQ の追加・編集・削除 |
| 管理画面（メニュー管理） | メニュー名・料金・説明の追加・編集・削除 |
| 会話ログ | ユーザー単位の会話履歴・エスカレーション状況の確認 |
| お知らせ配信 | 過去に LINE でやり取りしたユーザー全員への一斉配信（2段階確認あり） |
| 管理画面認証 | HMAC-SHA256 Cookie による管理者ログイン |

[FAQ管理画面]
<img width="2940" height="1522" alt="59A658D7-890F-4A65-B291-63165426CFA8" src="https://github.com/user-attachments/assets/0f716a6e-4be2-4c4f-88d2-709f9c705afd" />


[会話ログ画面]
<img width="2940" height="1522" alt="56CA320F-FC19-415D-B030-20E01D5C7D18" src="https://github.com/user-attachments/assets/c2707b3c-bee1-4ef2-a45a-1672c7f48b7f" />


## 使用技術

| カテゴリ | 技術 |
|---|---|
| フレームワーク | [Next.js 16](https://nextjs.org)（App Router） |
| 言語 | TypeScript（strict モード） |
| スタイリング | Tailwind CSS |
| データベース | [Supabase](https://supabase.com) |
| AI | [Claude API](https://www.anthropic.com)（Anthropic） |
| メッセージング | [LINE Messaging API](https://developers.line.biz/ja/services/messaging-api/) |
| ホスティング | [Vercel](https://vercel.com) |

## 公開 URL

```
https://line-bot-mvp.vercel.app
```

## システム構成

```
LINE ユーザー
  └─ メッセージ送信
       └─ Webhook（POST /api/webhook）
            ├─ Supabase（FAQ・メニュー取得）
            ├─ Claude API（回答生成・確信度スコアリング）
            └─ LINE Messaging API
                 ├─ 確信度 ≥ 5 → ユーザーへ返信
                 └─ 確信度 ≤ 4 → オーナーにエスカレーション通知

管理者
  └─ /admin/*（認証済み）
       ├─ /admin/faqs       — FAQ 管理
       ├─ /admin/menus      — メニュー管理
       ├─ /admin/conversations — 会話ログ
       └─ /admin/broadcast  — お知らせ配信
```

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/nobunori47/line-bot-mvp.git
cd line-bot-mvp
npm install
```

### 2. 環境変数の設定

`.env.local` を作成し、以下を設定してください。

```env
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
LINE_OWNER_USER_ID=
ADMIN_PASSWORD=
```

各値の取得方法：
- `LINE_CHANNEL_*` — [LINE Developers コンソール](https://developers.line.biz/console/) のチャネル設定
- `ANTHROPIC_API_KEY` — [Anthropic Console](https://console.anthropic.com/)
- `SUPABASE_URL` / `SUPABASE_SECRET_KEY` — [Supabase ダッシュボード](https://supabase.com/dashboard) のプロジェクト設定
- `LINE_OWNER_USER_ID` — オーナー自身の LINE ユーザー ID
- `ADMIN_PASSWORD` — 管理画面ログインに使う任意のパスワード

### 3. Supabase テーブルの作成

Supabase の SQL エディタで以下を実行してください。

```sql
create table faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table menus (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price integer not null,
  description text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  line_user_id text not null,
  user_message text not null,
  bot_response text not null,
  confidence integer not null,
  confidence_label text not null,
  escalated boolean not null default false,
  created_at timestamptz default now()
);
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000/admin](http://localhost:3000/admin) を開いてください。

LINE Webhook の接続には [ngrok](https://ngrok.com/) 等のトンネリングツールが必要です。

```bash
ngrok http 3000
```

取得した URL（例：`https://xxxx.ngrok.io`）を LINE Developers コンソールの Webhook URL に設定してください。

## 主なコマンド

```bash
npm run dev      # 開発サーバー起動（http://localhost:3000）
npm run build    # 本番ビルド（型チェックを含む）
npm run lint     # ESLint チェック
npx tsc --noEmit # 型チェックのみ
```

## ライセンス

MIT
