# Gariton Lab

スマホアプリと Web アプリを企画・開発・運営する個人スタジオ「Gariton Lab」の公式サイトです。

## Cloudflare 構成

このサイトは Cloudflare Workers 上で動作します。

- Next.js 互換ランタイム: vinext
- アプリ、ポリシーメタデータ、問い合わせ: D1 (`DB` binding)
- アイコン、スクリーンショット、Markdown: R2 (`UPLOADS` binding)
- 静的アセット: Workers Static Assets (`ASSETS` binding)

Cloudflare Pages は Next.js の静的 export 向けです。このサイトは Route Handler、管理ログイン、アップロード、問い合わせ保存を使うフルスタックアプリなので、Cloudflare の現行推奨に従って Workers を利用します。オンプレミスのオリジンサーバーは本番経路に不要です。

## ローカル開発

Node.js 22 以上を使用します。

```bash
npm ci
cp .env.example .env
npm run db:migrate:local
npm run dev
```

`http://localhost:3000` を開きます。D1 と R2 のローカルデータは `.wrangler/` に保存されます。

管理ページは公開ナビゲーションには表示されません。URL は `.env` の `ADMIN_SLUG` で決まり、`http://localhost:3000/owner/{ADMIN_SLUG}` です。

## Cloudflare リソースの準備

Wrangler にログインし、D1 と R2 を作成します。

```bash
npx wrangler login
npx wrangler d1 create gariton-site
npx wrangler r2 bucket create gariton-site-uploads
```

作成時に D1 の ID が表示された場合は、`wrangler.jsonc` の `d1_databases[0].database_id` に設定します。リソース名を変更する場合は `wrangler.jsonc` と、必要に応じてデータ移行用の `CLOUDFLARE_D1_DATABASE` / `CLOUDFLARE_R2_BUCKET` も同じ値にします。

次に本番 D1 へスキーマを適用します。

```bash
npm run db:migrate:remote
```

## Secrets と環境変数

以下は Cloudflare dashboard の Worker settings、または `wrangler secret put <NAME>` で設定します。

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SLUG`
- `AUTH_SECRET`
- `AUTH_COOKIE_SECURE=true`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_SITE_URL`
- `ADMOB_PUBLISHER_ID`（任意）
- `CONTACT_TO_EMAIL`
- `SMTP_HOST`、`SMTP_PORT`、`SMTP_SECURE`、`SMTP_USER`、`SMTP_PASSWORD`、`SMTP_FROM_EMAIL`（通知を使う場合）

`AUTH_SECRET` には十分長いランダム値を使用してください。SMTP は Cloudflare Workers から接続可能な submission port（通常 465 または 587）を使い、port 25 は使わないでください。

`NEXT_PUBLIC_` 変数はクライアントビルドにも使われるため、Workers Builds を利用する場合は Build variables にも設定します。

## 既存データの移行

オンプレ環境の Docker volume を停止前にバックアップし、`db.json`、`icons/`、`screenshots/`、`policies/` を同じディレクトリに配置します。既定の保存先は `/data` です。

```bash
npm run migrate:cloudflare -- /path/to/exported-data
```

このコマンドは本番 D1 に migration とレコードを適用し、ファイルを本番 R2 にアップロードします。繰り返し実行しても同じ ID のレコードは更新されます。実行前にバックアップを保管してください。

## ビルドとデプロイ

```bash
npm run lint
npm run build
npm run deploy
```

Workers Builds を GitHub リポジトリへ接続する場合は、production branch を `main`、build command を `npm run build`、deploy command を `npm run deploy` にします。Pull Request では preview deployment を確認してから merge します。

カスタムドメインを Worker に追加し、以下を確認してから既存の Tunnel / オンプレ公開を停止します。

- トップ、製品一覧、問い合わせページ
- 管理ログイン、アプリ作成・更新
- アイコン、スクリーンショット、ポリシーのアップロードと表示
- 問い合わせ保存とメール通知
- `/app-ads.txt`、`/sitemap.xml`、`/robots.txt`

問題がある場合は Worker のカスタムドメインを外して旧経路へ戻し、`wrangler rollback` で直前の Worker version に戻せます。データ移行後に旧環境へ戻す場合は、その間に D1 へ入った更新を失わないよう、先に D1/R2 のバックアップを取得してください。

## 主な機能

- Gariton Lab の紹介と公開プロダクト一覧
- iOS アプリ、アイコン、スクリーンショットの管理
- Markdown による説明とロケール別プライバシーポリシー
- 管理ログイン
- 問い合わせの保存と SMTP 通知
- OGP、サイトマップ、robots.txt、app-ads.txt
