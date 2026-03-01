# Openclaw Blog - Vercel デプロイメントガイド

このドキュメントは、Openclaw BlogプロジェクトをVercelにデプロイする手順を説明しています。

## 前提条件

- GitHubアカウント
- Vercelアカウント（無料で作成可能）
- Anthropic APIキー

## ステップ1: GitHubへのプッシュ

### 1.1 Gitリポジトリを初期化

```bash
cd ~/projects/openclaw-blog
git init
git add .
git commit -m "Initial commit: Openclaw Blog Auto-Writing System"
```

### 1.2 GitHubにプッシュ

```bash
# GitHubで新しいリポジトリを作成後
git remote add origin https://github.com/YOUR_USERNAME/openclaw-blog.git
git branch -M main
git push -u origin main
```

## ステップ2: Vercelでプロジェクトを作成

### 2.1 Vercelダッシュボードにログイン

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン

### 2.2 新しいプロジェクトをインポート

1. 「Add New」→「Project」をクリック
2. GitHubリポジトリ「openclaw-blog」を選択
3. 「Import」をクリック

### 2.3 プロジェクト設定

**Build & Development Settings:**
- Framework Preset: `Next.js` （自動検出）
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables:**

「Environment Variables」セクションで以下を追加：

| キー | 値 |
|------|-----|
| `ANTHROPIC_API_KEY` | あなたのAnthropicAPIキー |

### 2.4 デプロイ

「Deploy」ボタンをクリックしてデプロイを開始します。デプロイが完了するまで数分待ちます。

## ステップ3: 環境変数の確認

デプロイ完了後、Vercelダッシュボードで以下を確認：

1. プロジェクト設定 → Settings → Environment Variables
2. `ANTHROPIC_API_KEY` が正しく設定されているか確認

## ステップ4: デプロイメントURLの取得

デプロイ完了後、以下のURLでブログにアクセス可能：

```
https://openclaw-blog-[random-id].vercel.app
```

カスタムドメインを設定することも可能です。

## トラブルシューティング

### デプロイが失敗する場合

**ログを確認:**

1. Vercelダッシュボード → デプロイ → Logs
2. エラーメッセージを確認

**一般的な問題:**

- `ANTHROPIC_API_KEY` が設定されていない
  - Solution: Environment Variablesで設定を追加して、再デプロイ

- `Module not found` エラー
  - Solution: `npm install` を実行してから再度コミット・プッシュ

- ビルド時間が長い
  - Next.jsの最初のビルドは時間がかかります。通常は3-5分

### API エンドポイントが動作しない

**確認項目:**

1. `ANTHROPIC_API_KEY` が設定されているか確認
2. APIキーが有効か確認
3. `/api/generate` エンドポイントへのリクエストをテスト

```bash
curl -X POST https://openclaw-blog-[id].vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "テスト記事",
    "category": "PRACTICAL"
  }'
```

## 継続的なデプロイメント

Vercelはデフォルトで継続的デプロイメント（Continuous Deployment）を有効にしています。

### 自動デプロイのトリガー

- `main` ブランチへの `git push` で自動デプロイ
- Pull Requestごとにプレビューデプロイを作成

### Preview Deployments

PRを作成すると、Vercelが自動的にプレビューURLを生成します：

```
https://openclaw-blog-[branch-name].vercel.app
```

## 環境変数の更新

環境変数を更新した場合：

1. Vercelダッシュボード → Settings → Environment Variables で変更
2. 最新の本番環境を再デプロイ

または

2. `git push` でコード変更をプッシュする（自動で最新環境変数を使用）

## カスタムドメインの設定

1. Vercelダッシュボード → Project Settings → Domains
2. 「Add」をクリック
3. カスタムドメインを入力
4. DNSレコードを追加（手順に従う）

## パフォーマンス最適化

### 画像最適化

`next/image` を使用して自動的に最適化：

```typescript
import Image from 'next/image'

<Image
  src="/image.png"
  alt="Description"
  width={800}
  height={600}
/>
```

### キャッシング

Vercelは自動的にStaticなコンテンツをキャッシュします。`/content/posts/` は静的コンテンツとして扱われます。

### ISR（Incremental Static Regeneration）

記事ページはISRで自動更新されます：

```typescript
export const revalidate = 3600; // 1時間ごとに更新
```

## セキュリティのベストプラクティス

### 1. APIキーの安全な管理

- Verselの Environment Variables で管理
- コードに直接キーを記載しない
- `.env.local` をGitで無視（`.gitignore` で設定）

### 2. Rate Limiting

APIエンドポイントにレート制限を追加：

```typescript
// middleware.ts で実装可能
```

### 3. CORS設定

必要に応じてCORSを設定：

```typescript
// app/api/generate/route.ts
export async function POST(request: NextRequest) {
  // CORSチェック
  const origin = request.headers.get('origin');
  // ...
}
```

## モニタリング

### Vercel Analytics

1. Project → Settings → Analytics
2. Web Analytics を有効にする（無料）
3. パフォーマンスメトリクスを監視

### Error Tracking

Vercelは自動的にエラーを追跡します：

1. Monitoring タブで確認
2. エラーの詳細ログを確認

## スケーリング

Vercelは自動的にスケーリングします：

- トラフィック増加時は自動的に複数インスタンスで実行
- 追加コスト不要（Pro プラン以上推奨）

## よくある質問

### Q: ブログ記事を更新したい

A: `/content/posts/` のMarkdownファイルを編集して、GitHubにプッシュします。Vercelが自動デプロイします。

### Q: Agent Teamを毎日実行したい

A: GitHub Actionsで定期実行を設定し、生成されたMDをGitHubにコミットします。

```yaml
# .github/workflows/daily-blog-generate.yml
name: Daily Blog Generation

on:
  schedule:
    - cron: '0 9 * * *'  # 毎日 9:00 UTC に実行

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate blog post
        run: npx tsx agents/index.ts
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      - name: Commit and push
        run: |
          git config user.email "action@github.com"
          git config user.name "GitHub Action"
          git add content/posts/
          git commit -m "Auto-generated blog post" || true
          git push
```

### Q: ローカルとVercelで異なる動作をしている

A: 以下を確認：
1. Node.jsバージョンの確認（`.nvmrc` で固定）
2. 環境変数の確認
3. ローカルで `npm run build` をテスト

## サポート

問題が解決しない場合：

- [Vercel ドキュメント](https://vercel.com/docs)
- [Anthropic APIドキュメント](https://docs.anthropic.com/)
- GitHub Issues で質問
