# App Support Hub

iOS App Store 審査で必要になるサポート URL とプライバシーポリシーを公開する Next.js アプリです。

## 機能

- 複数 iOS アプリの登録
- アプリ説明の Markdown 記述と HTML 表示
- アプリごとのアイコン画像設定
- 管理者のみログインできる管理ページ
- アプリごとのサポートページ
- ロケール別 Markdown プライバシーポリシーのアップロードと表示切替
- 登録済みアプリを選択できる問い合わせフォーム
- Docker volume によるデータ永続化

## 起動

```bash
cp .env.example .env
docker compose up --build
```

ブラウザで `http://localhost:3000` を開きます。
既に 3000 番ポートを使っている場合は、`.env` の `HOST_PORT=3001` のように変更してください。

管理ページは公開ナビゲーションには表示されません。URL は `.env` の `ADMIN_SLUG` で決まり、`http://localhost:3000/owner/{ADMIN_SLUG}` です。

`.env` の `ADMIN_USERNAME`、`ADMIN_PASSWORD`、`ADMIN_SLUG`、`AUTH_SECRET` は本番公開前に必ず変更してください。HTTPS 環境で運用する場合は `AUTH_COOKIE_SECURE=true` にしてください。HTTP のローカル確認では `false` のままにします。

## Markdown ファイル

管理ページから、対象アプリ、ロケール、`.md` ファイルを指定してアップロードします。

例:

```md
# Privacy Policy

This app does not collect personal data.

## Contact

For questions, contact support@example.com.
```

公開 URL は `/apps/{slug}/privacy?lang=ja` の形式です。

## データ保存先

Docker では `/data` を `app_data` volume として永続化します。

- `/data/db.json`: アプリ、ポリシーメタデータ、問い合わせ
- `/data/icons/*`: アップロードされたアプリアイコン
- `/data/policies/*.md`: アップロードされた Markdown
