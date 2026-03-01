# Openclaw Blog Auto-Writing System

Openclawの実務活用に関するブログを自動で企画・執筆・編集・SEO処理するAgent Teamを Claude SDKで構築し、Next.jsでUIを提供するシステムです。

## 🚀 主な機能

- **AI Agent Team**: Claude Opus/Sonnet/Haikuを使用した複数エージェントの協調作業
- **自動ブログ生成**: テーマ企画 → 本文執筆 → 校正 → SEO処理の全自動化
- **ダークテーマUI**: maria-code.ai/blogsを参考にしたモダンなカードベースデザイン
- **静的生成**: Next.js App Routerによる高速なブログ表示
- **完全なMarkdown管理**: `/content/posts/`でMarkdownファイルを管理

## 📁 プロジェクト構成

```
openclaw-blog/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # ルートレイアウト
│   ├── page.tsx                  # ブログ一覧ページ
│   ├── blog/[slug]/page.tsx      # 記事詳細ページ
│   ├── globals.css               # グローバルスタイル
│   └── api/generate/route.ts     # Agent Team起動API
├── components/                   # React コンポーネント
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BlogCard.tsx
│   ├── BlogList.tsx
│   ├── SearchFilter.tsx
│   └── CategoryBadge.tsx
├── lib/
│   ├── markdown.ts               # MDファイル操作
│   └── types.ts                  # 型定義
├── content/posts/                # ブログ記事（Markdown）
├── agents/                       # Agent Team
│   ├── orchestrator.ts           # メインオーケストレーター
│   ├── planner.ts                # 企画エージェント
│   ├── writer.ts                 # 執筆エージェント
│   ├── editor.ts                 # 校正エージェント
│   ├── seo.ts                    # SEOエージェント
│   ├── types.ts                  # Agent型定義
│   └── index.ts                  # CLI エントリポイント
└── package.json
```

## 🔧 セットアップ

### 環境変数の設定

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

または `.env.local` ファイルを作成：

```
ANTHROPIC_API_KEY=your-api-key-here
```

### インストール

```bash
npm install
```

## 📝 使用方法

### ローカル開発

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

### ブログ記事を自動生成（CLI）

```bash
npx tsx agents/index.ts
```

このコマンドでAgent Teamが起動し、ブログ記事を自動生成してファイルを保存します。

カスタムトピックで生成する場合は、`agents/index.ts` を編集して `AgentInput` を変更してください：

```typescript
const input: AgentInput = {
  topic: "あなたのカスタムトピック",
  category: "PRACTICAL",
  keywords: ["キーワード1", "キーワード2"],
};
```

### ブログ記事を自動生成（API）

POST リクエストで `http://localhost:3000/api/generate` を呼び出します：

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Openclawのセキュリティベストプラクティス",
    "category": "INSIGHTS",
    "keywords": ["セキュリティ", "ベストプラクティス"]
  }'
```

## 🤖 Agent Team の仕組み

```
Orchestrator (claude-opus-4-6)
  ↓
Planner (claude-haiku-4-5)
  → テーマ・アウトライン生成
  ↓
Writer (claude-sonnet-4-6)
  → 3000文字本文執筆
  ↓
Editor (claude-haiku-4-5)
  → 文章校正・構成整理
  ↓
SEO Agent (claude-haiku-4-5)
  → SEOメタデータ生成
  ↓
Quality Check (claude-opus-4-6)
  → 最終品質確認
  ↓
Save to File
  → /content/posts/[slug].md に保存
```

## 📄 ブログ記事フォーマット

すべてのMarkdownファイルは以下のフロントマターを含む必要があります：

```markdown
---
title: "記事タイトル"
date: "2026-03-01"
category: "PRACTICAL"
tags: ["タグ1", "タグ2", "タグ3"]
description: "記事の説明"
seo_title: "検索結果に表示されるタイトル"
seo_description: "メタディスクリプション"
slug: "article-slug"
---

# 本文...
```

### カテゴリ

- `PRACTICAL`: 実務活用
- `TUTORIAL`: チュートリアル
- `INSIGHTS`: インサイト
- `CASE_STUDY`: ケーススタディ
- `ANNOUNCEMENT`: お知らせ

## 🎨 UI デザイン

### カラースキーム

- **背景**: `#0a0a0f` (Deep Dark)
- **カード背景**: `#111118` + border `#222235`
- **アクセント**: `#7c3aed` (Purple) → `#4f46e5` (Indigo)
- **テキスト**: `#f8fafc` (Primary) / `#94a3b8` (Muted)

### フォント

- `Inter` + `Noto Sans JP` (日本語)

## 🚀 Vercel へのデプロイ

### デプロイの準備

1. GitHubにリポジトリをプッシュ
2. Vercelダッシュボードで新しいプロジェクトを作成
3. GitHubリポジトリを選択

### 環境変数の設定

Vercelプロジェクト設定で以下を追加：

| キー | 値 |
|------|-----|
| `ANTHROPIC_API_KEY` | あなたのAnthropicAPIキー |

### デプロイ

GitHubにプッシュするだけで自動デプロイが開始されます。

```bash
git push origin main
```

## 📊 パフォーマンス

- **ブログ一覧**: 静的生成（ISR対応）
- **記事詳細**: 静的生成（ISR対応）
- **API エンドポイント**: サーバーレス（Vercel Functions）

## 🔐 セキュリティ

- すべてのAPI キーは環境変数で管理
- `/content/posts/` はGitで管理（履歴追跡可能）
- APIエンドポイントにはレート制限を推奨

## 📝 カスタマイズ

### ブログカードのスタイル変更

`components/BlogCard.tsx` を編集します。

### UIカラーの変更

`app/globals.css` と `tailwind.config.ts` で色を変更します。

## 🐛 トラブルシューティング

### ブログが表示されない

- `/content/posts/` ディレクトリが存在するか確認
- Markdownファイルのフロントマターが正しいか確認

### Agent Team実行エラー

- `ANTHROPIC_API_KEY` が設定されているか確認
- APIキーが有効か確認
- ネットワーク接続を確認

## 📚 参考リンク

- [Claude API Documentation](https://docs.anthropic.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 ライセンス

MIT

## 👥 サポート

問題が発生した場合は、GitHubのIssueを作成してください。
