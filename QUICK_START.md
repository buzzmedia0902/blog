# Openclaw Blog - クイックスタート

## 🚀 30秒で始める

### 1. 環境変数の設定

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

### 2. 開発サーバーの起動

```bash
cd ~/projects/openclaw-blog
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

### 3. ブログ記事を自動生成

#### CLIで生成:
```bash
npx tsx agents/index.ts
```

#### APIで生成:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "あなたのトピック",
    "category": "PRACTICAL",
    "keywords": ["キーワード1", "キーワード2"]
  }'
```

### 4. 生成されたファイルを確認

```bash
cat content/posts/*.md
```

## 📋 チェックリスト

- [ ] Node.js 20+ がインストール済み
- [ ] `ANTHROPIC_API_KEY` を環境変数に設定
- [ ] `npm install` を実行
- [ ] `npm run dev` でサーバー起動
- [ ] ブログ一覧が表示される (http://localhost:3000)
- [ ] CLIでブログ記事を生成
- [ ] 新しい記事がブログ一覧に表示される

## 🔗 重要なファイル

| ファイル | 説明 |
|---------|------|
| `agents/index.ts` | CLI エントリポイント |
| `app/page.tsx` | ブログ一覧ページ |
| `content/posts/` | 生成されたブログ記事 |
| `DEPLOYMENT.md` | Vercel デプロイメントガイド |
| `README.md` | 完全なドキュメント |

## 📚 詳細はこちら

- 完全ドキュメント: `README.md`
- 実装詳細: `IMPLEMENTATION_SUMMARY.md`
- デプロイメント: `DEPLOYMENT.md`

## ❓ よくある質問

**Q: APIキーなしで実行できる？**
A: いいえ。`ANTHROPIC_API_KEY` が必須です。

**Q: 既存の記事を編集できる？**
A: はい。`/content/posts/` の Markdown ファイルを直接編集可能です。

**Q: 毎日自動で記事を生成したい**
A: GitHub Actions で設定可能です。詳細は `DEPLOYMENT.md` を参照。

---

**Ready to go!** 🎉
