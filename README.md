# 看護デジタルニュース / Nursing Digital News

看護・医療に関するデジタル技術の最新ニュースを配信するWebサイトです。管理画面から簡単にニュース記事を投稿・更新できます。

## 主な機能

- ✅ ニュース記事の一覧表示
- ✅ カテゴリ別の記事表示
- ✅ 記事詳細ページ
- ✅ 管理画面でのニュース投稿・編集・削除
- ✅ レスポンシブデザイン（PC・タブレット・スマホ対応）
- ✅ SQLiteデータベースによるデータ管理

## カテゴリ

- 電子カルテ
- 医療DX
- 看護教育
- デジタルヘルス
- その他

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), React 18, TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: SQLite (better-sqlite3)
- **バックエンド**: Next.js API Routes

## セットアップ方法

### 必要な環境

- Node.js 18以上
- npm または yarn

### インストール手順

1. リポジトリをクローン

```bash
git clone <repository-url>
cd Claude-code
```

2. 依存パッケージをインストール

```bash
npm install
```

3. サンプルデータを投入（オプション）

```bash
npx tsx lib/seed.ts
```

4. 開発サーバーを起動

```bash
npm run dev
```

5. ブラウザで開く

```
http://localhost:3000
```

## 使い方

### トップページ

- `http://localhost:3000` にアクセスすると、ニュース記事の一覧が表示されます
- カテゴリをクリックすることで、カテゴリ別の記事を表示できます
- 記事のタイトルをクリックすると詳細ページに移動します

### 管理画面

1. `http://localhost:3000/admin` にアクセスしてログイン

   **デフォルトログイン情報:**
   - ユーザー名: `admin`
   - パスワード: `admin123`

   ⚠️ **本番環境では必ずパスワードを変更してください**

2. ログイン後、ダッシュボードで以下の操作が可能です:
   - 新規記事の作成
   - 既存記事の編集
   - 記事の削除
   - 記事一覧の確認

### 記事の投稿

管理画面から以下の情報を入力して記事を投稿できます:

- **タイトル**: 記事のタイトル（必須）
- **カテゴリ**: 5つのカテゴリから選択（必須）
- **著者**: 記事の執筆者名（デフォルト: 編集部）
- **画像URL**: 記事のアイキャッチ画像（オプション）
- **本文**: 記事の内容（必須）

## プロジェクト構成

```
Claude-code/
├── app/                    # Next.js App Router
│   ├── page.tsx           # トップページ（ニュース一覧）
│   ├── layout.tsx         # ルートレイアウト
│   ├── globals.css        # グローバルスタイル
│   ├── articles/          # 記事詳細ページ
│   │   └── [id]/
│   │       └── page.tsx
│   ├── admin/             # 管理画面
│   │   ├── page.tsx       # ログインページ
│   │   └── dashboard/
│   │       └── page.tsx   # 記事管理ダッシュボード
│   └── api/               # API Routes
│       ├── articles/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       └── auth/
│           ├── login/route.ts
│           └── logout/route.ts
├── lib/                   # ライブラリ・ユーティリティ
│   ├── db.ts             # データベース接続と初期化
│   ├── articles.ts       # 記事関連の関数
│   ├── auth.ts           # 認証関連の関数
│   └── seed.ts           # サンプルデータ投入
├── components/            # 再利用可能なコンポーネント
├── public/               # 静的ファイル
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## API エンドポイント

### 記事関連

- `GET /api/articles` - すべての記事を取得
- `GET /api/articles?category={カテゴリ}` - カテゴリ別の記事を取得
- `GET /api/articles/{id}` - 特定の記事を取得
- `POST /api/articles` - 新しい記事を作成
- `PUT /api/articles/{id}` - 記事を更新
- `DELETE /api/articles/{id}` - 記事を削除

### 認証関連

- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト

## 本番環境へのデプロイ

### Vercel へのデプロイ

1. Vercelにプロジェクトをインポート
2. ビルドコマンド: `npm run build`
3. 出力ディレクトリ: `.next`

⚠️ **注意**: SQLiteは本番環境では推奨されません。PostgreSQLやMySQLなどのデータベースへの移行を検討してください。

## セキュリティに関する注意事項

- デフォルトの管理者パスワードは必ず変更してください
- 本番環境では環境変数を使用してパスワードを管理してください
- 簡易的なパスワードハッシュ化のみ実装されています。本番環境では`bcrypt`などを使用してください
- HTTPS通信を使用してください

## カスタマイズ

### カテゴリの追加・変更

以下のファイルでカテゴリを編集できます:

- `app/page.tsx` - トップページのカテゴリナビゲーション
- `app/admin/dashboard/page.tsx` - 管理画面のカテゴリ選択

### デザインの変更

- `tailwind.config.js` でカラースキームを変更できます
- `app/globals.css` でグローバルスタイルを変更できます

## ライセンス

ISC

## サポート

問題が発生した場合は、GitHubのIssueで報告してください。
