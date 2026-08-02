# Gariton Lab

スマホアプリと Web アプリを企画・開発・運営する個人スタジオ「Gariton Lab」の公式サイトです。
公開プロダクトの紹介に加えて、アプリサポートとプライバシーポリシーを提供します。

## 機能

- Gariton Lab の紹介と運営者情報
- 公開プロダクトの一覧・個別ページ
- 複数 iOS アプリの登録
- アプリ説明の Markdown 記述と HTML 表示
- アプリごとのアイコン画像設定
- 管理者のみログインできる管理ページ
- アプリごとのサポートページ
- ロケール別 Markdown プライバシーポリシーのアップロードと表示切替
- 一般・アプリサポート・不具合報告に対応した問い合わせフォーム
- 管理画面への問い合わせ保存と SMTP メール通知
- OGP、サイトマップ、robots.txt
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

AdMob の app-ads.txt を公開する場合は、`.env` の `ADMOB_PUBLISHER_ID` に AdMob のサイト運営者 ID（例: `pub-0000000000000000`）を設定してください。設定後、`/app-ads.txt` で `google.com, {ADMOB_PUBLISHER_ID}, DIRECT, f08c47fec0942fa0` が配信されます。未設定の場合は `/app-ads.txt` は 404 を返します。

## 問い合わせメール通知

問い合わせ内容は管理画面に保存された後、SMTP 経由で `CONTACT_TO_EMAIL` に通知されます。
`.env.example` を参考に `SMTP_HOST`、`SMTP_PORT`、`SMTP_USER`、`SMTP_PASSWORD`、`SMTP_FROM_EMAIL` を設定してください。
SMTP が未設定または一時的に失敗した場合も問い合わせ自体は保存され、通知状態を管理画面で確認できます。

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
