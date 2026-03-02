# freee 請求書作成 MCP スキル

freee会計システムで請求書を自動作成するための高度なMCPスキルです。API連携とブラウザ自動化により、請求書の作成から保存まですべてを自動処理します。

## 🎯 機能

### **1. API連携**
- ✅ freee API で取引先・請求書を管理
- ✅ 助成金管理システムから顧客情報を参照
- ✅ 自動で取引先を作成・検索

### **2. 完全自動化**
- ✅ 請求書作成ページへの自動ナビゲーション
- ✅ フォーム自動入力（特殊な入力方法対応）
- ✅ 税区分自動設定（内税固定）
- ✅ PDF自動ダウンロード

### **3. インテリジェント処理**
- ✅ 入金期日の自動計算（翌月末、土日調整）
- ✅ 顧客情報の自動参照
- ✅ エラーハンドリング

## 📋 セットアップ

### **前提条件**
- Node.js 18.0以上
- freee アカウント（accounting@buzzmedia.co.jp）
- freee API キー
- 助成金管理システムアクセス

### **インストール**

```bash
cd skills/freee-invoice-creator

# 依存パッケージをインストール
npm install

# TypeScriptをコンパイル
npm run build

# 環境変数を設定（.envファイルを作成）
cp .env.example .env
# .envに以下を入力：
# FREEE_API_KEY=your_key
# FREEE_ACCOUNT_ID=your_account_id
# SUBSIDY_API_KEY=your_key
# SUBSIDY_API_BASE_URL=https://joseikin.buzzmedia.co.jp/api
```

## 🚀 使用方法

### **1. 顧客を検索**

```bash
npm run dev -- search "会社名"
```

**レスポンス例:**
```json
{
  "success": true,
  "data": [
    {
      "id": "customer_123",
      "companyName": "BUZZ MEDIA株式会社",
      "representativeName": "今村雄飛",
      "email": "info@buzzmedia.co.jp"
    }
  ]
}
```

### **2. 顧客情報を取得**

```bash
npm run dev -- get-customer customer_123
```

**レスポンス例:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "customer_123",
      "companyName": "BUZZ MEDIA株式会社",
      "representativeName": "今村雄飛"
    },
    "application": {
      "trainingDate": "2026-03-15",
      "trainingParticipants": 5
    },
    "suggestedInvoiceData": {
      "trainingParticipants": 5,
      "trainingDate": "2026-03-15"
    }
  }
}
```

### **3. 請求書を作成**

```bash
npm run dev -- create-invoice customer_123 5
```

**パラメータ:**
- `customerId`: 顧客ID（助成金管理システムから取得）
- `trainingParticipants`: 研修参加人数
- `--date`: 請求日（オプション、デフォルト: 今日）
- `--dueDate`: 入金期日（オプション、デフォルト: 翌月末）

**レスポンス例:**
```json
{
  "success": true,
  "invoiceId": "123456789",
  "pdfUrl": "https://app.secure.freee.co.jp/invoices/123456789/pdf",
  "errorMessage": null
}
```

## 🔧 固定値

以下の値は常に固定です（SKILL.md参照）：

| 項目 | 値 |
|------|-----|
| 自社担当者 | 代表取締役 今村雄飛 |
| 件名 | Aibee実務活用AIカリキュラム利用料 |
| 品目 | Aibee実務活用AIカリキュラム |
| 単価 | 400,000円（税込み） |
| 税区分 | 内税（必須） |

## ⚙️ 環境変数

```bash
# freee API
FREEE_API_KEY=PSri8ULbKZVvZELR9-Ti-ISmndcfjNLf6kQk0iLiAWA
FREEE_ACCOUNT_ID=10445315

# 助成金管理システム
SUBSIDY_API_KEY=Yd4JvvlJlSc4XV7Ne0RRqRaL2OAdGmwO-3lvnf1PKYc
SUBSIDY_API_BASE_URL=https://joseikin.buzzmedia.co.jp/api

# ブラウザ自動化
BROWSER_HEADLESS=true
BROWSER_TIMEOUT=30000

# ログレベル
LOG_LEVEL=info
```

## 🐛 トラブルシューティング

### **API接続エラー**

```
Error: Cannot connect to freee API
```

**解決方法:**
- FREEE_API_KEY が正しいか確認
- FREEE_ACCOUNT_ID が正しいか確認
- freeeアカウントが有効か確認

### **顧客が見つからない**

```
Error: No customer found
```

**解決方法:**
- 助成金管理システムに顧客が登録されているか確認
- 顧客名が正しいか確認
- SUBSIDY_API_KEY が正しいか確認

### **請求書の金額が間違っている**

```
Invoice total: 2,200,000 (should be 2,000,000)
```

**解決方法:**
- 税区分が「内税」に設定されているか確認（SKILL.mdを参照）

## 📚 詳細ドキュメント

- **SKILL.md**: スキルの詳細な説明と操作手順
- **references/fixed_values.md**: 固定値とルール
- **src/types.ts**: TypeScript 型定義

## 📦 ファイル構成

```
freee-invoice-creator/
├── src/
│   ├── mcp-server.ts              # MCPサーバーのメイン実装
│   ├── freee-client.ts            # freee API クライアント
│   ├── subsidy-client.ts          # 助成金管理システムクライアント
│   ├── browser-automation.ts      # Playwright ブラウザ自動化
│   ├── config.ts                  # 設定・環境変数管理
│   ├── types.ts                   # TypeScript 型定義
│   └── utils.ts                   # ユーティリティ
├── dist/                          # コンパイル後のJavaScript
├── package.json                   # 依存パッケージ
├── tsconfig.json                  # TypeScript設定
├── skill.json                     # スキル定義
├── .env                           # 環境変数（git無視）
├── .env.example                   # 環境変数テンプレート
├── SKILL.md                       # スキルドキュメント
└── README.md                      # このファイル
```

## 🔐 セキュリティ

- ⚠️ **`.env` をコミットしないでください**
- ⚠️ **APIキーを安全に保管してください**
- ⚠️ **本番環境では環境変数を Vercel に設定してください**

## 📝 ライセンス

MIT

## 👥 サポート

問題が発生した場合は、SKILL.md の「トラブルシューティング」セクションを参照してください。
