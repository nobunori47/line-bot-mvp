# 要件定義書: LINE bot + AI 自動応答（美容室オーナー向け）

## 1. 背景・目的
- 1日10〜15件（土日はそれ以上）のLINE問い合わせに、オーナーが手動対応している
- 営業時間外も即レス対応を求められ、休めない状態
- 同じ質問（営業時間・料金・アクセス・施術組み合わせ・予約案内）が繰り返される
- 臨時休業などのお知らせを友だち300人へ伝える手段が手動運用

## 2. スコープ

### やること
- FAQ自動応答（Claude APIによる自然文回答）
  - 営業時間 / メニュー・料金 / アクセス・駐車場 / 施術の組み合わせ可否 / 予約に関する問い合わせへの案内
- 確信度判定によるエスカレーション（低確信度の質問はオーナーへLINE通知）
- 管理画面（FAQ・料金情報・お知らせ文を簡易的に編集できる。配信履歴・顧客管理・分析機能は対象外）
- お知らせ一斉配信（友だち全員へテキスト送信）

### やらないこと
- 予約受付・予約変更・予約キャンセルの自動処理は対象外（運用方法は別途相談）
- 決済機能 / 顧客カルテ・来店履歴管理 / クーポン管理 / 多言語対応

### Phase 2（将来検討）
- 予約システム連携（カレンダー連携・空き状況自動応答）
- 来店履歴に基づくパーソナライズ応答
- クーポン配信機能

## 3. システム構成
LINE（友だち300人）

↓ Webhook

Next.js API Route（App Router）

↓

Supabase（faq / menus / conversations）

↓

Claude API（応答生成 + 確信度判定）

↓

LINE返信 / オーナーへエスカレーション通知

## 4. データベース設計（Supabase）

### faq
| 項目 | 型 |
|---|---|
| id | uuid |
| question | text |
| answer | text |
| category | text |
| created_at | timestamp |
| updated_at | timestamp |

### menus
| 項目 | 型 |
|---|---|
| id | uuid |
| name | text |
| price | integer |
| description | text |
| created_at | timestamp |
| updated_at | timestamp |

### conversations
| 項目 | 型 |
|---|---|
| id | uuid |
| line_user_id | text |
| user_message | text |
| bot_response | text |
| confidence | integer |
| confidence_label | text |
| escalated | boolean |
| created_at | timestamp |

## 5. 確信度判定ルール
- Claude APIに「FAQに直接該当する記述がない場合は確信度を5以下にすること」と明示的にルールを与える
- confidenceは数値（0〜10）とconfidence_labelの2軸で保持する

| confidence | confidence_label |
|---|---|
| 8〜10 | high |
| 5〜7 | medium |
| 0〜4 | low |

- confidence 5以上（medium/high） → そのままLINE返信
- confidence 4以下（low） → オーナーへLINE通知（エスカレーション）

## 6. 回答生成フロー
ユーザー質問

↓

FAQ検索（最優先の回答根拠とする）

↓

該当あり → FAQの内容を根拠にClaudeが回答を整形

該当なし → Claudeが一般的な文脈で補完回答を生成（確信度は低めに判定されやすい）

## 7. MVP段階定義
1. Echo応答（オウム返し）が動く
2. FAQ応答（Claude API連携）が動く
3. エスカレーション（確信度判定＋通知）が動く
4. 管理画面（FAQ CRUD・メニュー編集・お知らせ配信）が動く

## 8. 非機能要件
- 応答時間：3秒以内（Webhookタイムアウト対策）
- 管理画面：スマホ操作を前提（ボタン44px以上、専門用語回避、処理中表示）
- コスト：初期費用10〜15万円程度、月額2,000〜3,000円程度に収める（Vercel/Supabase無料枠＋Claude API従量課金）

## 9. テスト項目
- FAQ全パターン（営業時間/メニュー/料金/アクセス/施術組合せ/予約案内）
- エスカレーション通知の到達確認
- お知らせ一斉配信の到達確認
- エッジケース（空メッセージ・長文・絵文字・スタンプ）
- 応答時間（3秒以内）

## 10. MVP段階3 管理画面

### 概要
美容室オーナー1名運用を想定した管理画面。ADMIN_PASSWORDによる簡易認証で保護する。

### 認証
- 環境変数 `ADMIN_PASSWORD` による簡易パスワード認証（DB管理ユーザーなし）
- ログインページ: `/admin/login`
  - パスワード入力 → 一致したらCookieセット → `/admin` へリダイレクト
- Cookie名: 例 `admin_session`（値は固定トークンではなく、ADMIN_PASSWORDのハッシュ等を使った検証可能な値にする）
- 有効期限: 7日（`maxAge: 60 * 60 * 24 * 7`）
- 保護方式: **Next.js Middleware（middleware.ts）** で `/admin/*` を一括保護
  - Cookie未設定・不正な場合は `/admin/login` にリダイレクト
  - `/admin/login` 自体は保護対象から除外
- ログアウト機能: Cookie削除エンドポイント（任意ボタン）
- 認証ロジック（Cookie生成・検証）は `lib/auth.ts` に共通化し、Middlewareとログイン処理（`app/admin/login/actions.ts`等）の両方から呼び出す
  - Middleware（edge runtime）でも動作するAPIのみを使用すること（Node.js専用APIに依存しない）

### ダッシュボード（/admin）
- FAQ件数
- 本日の問い合わせ件数（conversations件数 / 当日分）
- エスカレーション件数
  - **既存の `conversations.escalated` カラム（boolean）をそのまま使用する**（confidence_labelからの再判定は行わない）
- 各管理機能へのナビゲーション

### FAQ管理（/admin/faqs）
- 実装方式: **編集ページ遷移**（モーダルなし）
  - `/admin/faqs` 一覧
  - `/admin/faqs/new` 新規作成
  - `/admin/faqs/[id]` 編集
- 一覧: question・answer・category等の表示、削除ボタン
- 新規作成・編集: フォーム（既存カラムに準拠）
- 削除: 確認ダイアログ付き

### 会話ログ（/admin/conversations）
- 表示粒度: **ユーザー単位でまとめる**
  - 一覧: line_user_idごとに「最終問い合わせ日時」「最終メッセージ概要」を表示
  - 行をクリック → `/admin/conversations/[lineUserId]` で会話履歴詳細を表示（時系列）
- エスカレーションされた会話は一覧上で視覚的に区別（バッジ等）
  - 判定基準: `escalated = true`（ダッシュボードと同じ定義）

### お知らせ配信（/admin/broadcast）
- 対象: conversationsテーブルに記録されたユーザー（line_user_idの重複は除外）
- **誤送信防止フロー（2段階確認）**:
  1. メッセージ入力フォーム
  2. 確認画面に遷移
     - 送信対象人数を表示
     - 対象ユーザーIDの先頭5件程度をサンプル表示
     - 入力したメッセージ本文を再表示
     - 「送信する」「キャンセル（戻る）」ボタン
  3. 「送信する」押下時のみ実際にLINE pushMessageを実行
     - **対象ユーザーへは順次送信**（`Promise.all`等による並列大量送信は行わない）
     - 送信失敗時はエラーログを記録し、他ユーザーへの送信は継続する（途中で処理を止めない）
- 送信結果（成功件数・失敗件数）を集計して画面に表示

### メニュー管理（/admin/menus）
- 対象項目（既存スキーマのまま）:
  - name
  - price
  - description
- 機能: 一覧 / 新規作成 / 編集 / 削除（FAQ管理と同様にページ遷移方式）
- ※ duration / category / is_active は将来拡張項目として保留（MVP段階3では追加しない）

### UIスタイル
- Tailwind CSSのみ、シンプルな管理画面UI
- shadcn/ui・Material UI・管理画面テンプレートは導入しない
- 機能の完成・正確さを優先

### 実装順序
1. 管理画面トップ（ダッシュボード）+ 認証（Middleware・Cookie）
2. FAQ管理（一覧・新規・編集・削除）
3. 会話ログ（ユーザー単位一覧 → 詳細）
4. お知らせ配信（入力 → 確認 → 送信の2段階フロー）
5. メニュー管理（一覧・新規・編集・削除）

### スコープ外（今回やらないこと）
- Supabase Authなどの本格的なログイン機能
- usersテーブルの新規作成
- menusテーブルのカラム拡張（duration/category/is_active）
- 配信対象の絞り込み（個別選択送信など）