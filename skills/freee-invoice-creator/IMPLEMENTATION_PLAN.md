# freee 請求書作成 MCP スキル実装計画

## 実装ファイル構造

```
skills/freee-invoice-creator/
├── SKILL.md                      # スキル定義書
├── IMPLEMENTATION_PLAN.md        # この実装計画
├── src/
│   ├── mcp-server.ts            # MCPサーバー メイン実装
│   ├── freee-client.ts          # freee API クライアント
│   ├── subsidy-client.ts        # 助成金管理システムクライアント
│   ├── browser-automation.ts    # ブラウザ自動化 (Playwright)
│   ├── types.ts                 # TypeScript 型定義
│   ├── config.ts                # 設定・環境変数
│   ├── utils.ts                 # ユーティリティ
│   └── handlers.ts              # ツールハンドラー
├── references/
│   └── fixed_values.md          # 固定値リファレンス
├── package.json                 # 依存パッケージ
└── .env.example                 # 環境変数テンプレート
```

## 実装ステップ

### Phase 1: 基本構造
- [ ] package.json を作成（依存パッケージ定義）
- [ ] TypeScript 設定
- [ ] 型定義ファイル (types.ts) を実装
- [ ] 設定ファイル (config.ts) を実装

### Phase 2: API クライアント
- [ ] freee API クライアント実装
- [ ] 助成金管理システムクライアント実装
- [ ] エラーハンドリング

### Phase 3: ブラウザ自動化
- [ ] Playwright セットアップ
- [ ] ブラウザ自動化関数実装
- [ ] フォーム入力ロジック

### Phase 4: MCP サーバー
- [ ] MCPサーバー実装
- [ ] ツールハンドラー実装
- [ ] エラーハンドリング

### Phase 5: テスト・デバッグ
- [ ] 単体テスト
- [ ] 統合テスト
- [ ] デバッグとログ

## 必要な環境変数

```
# freee API
FREEE_API_KEY=xxx
FREEE_ACCOUNT_ID=xxx

# 助成金管理システム
SUBSIDY_API_KEY=xxx
SUBSIDY_API_BASE_URL=xxx

# ブラウザ自動化
BROWSER_HEADLESS=true
BROWSER_TIMEOUT=30000

# ログ
LOG_LEVEL=info
```

## 依存パッケージ

```json
{
  "@anthropic-ai/sdk": "latest",
  "playwright": "^1.40.0",
  "axios": "^1.6.0",
  "dotenv": "^17.3.1",
  "typescript": "^5.3.0"
}
```

## 実装の優先順位

1. **高優先**: freee API クライアント + ブラウザ自動化
2. **中優先**: 助成金管理システムクライアント
3. **低優先**: ログ・エラーハンドリング強化

---

準備完了。実装開始します。
