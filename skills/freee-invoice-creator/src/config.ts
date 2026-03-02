import "dotenv/config";
import type { Config } from "./types";

const requiredEnvVars = [
  "FREEE_API_KEY",
  "FREEE_ACCOUNT_ID",
  "SUBSIDY_API_KEY",
  "SUBSIDY_API_BASE_URL",
];

// 環境変数の検証
function validateEnvVars() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

export function getConfig(): Config {
  validateEnvVars();

  return {
    freee: {
      apiKey: process.env.FREEE_API_KEY || "",
      accountId: process.env.FREEE_ACCOUNT_ID || "",
      baseUrl: "https://api.freee.co.jp/api/1",
    },
    subsidy: {
      apiKey: process.env.SUBSIDY_API_KEY || "",
      baseUrl: process.env.SUBSIDY_API_BASE_URL || "",
    },
    browser: {
      headless: process.env.BROWSER_HEADLESS !== "false",
      timeout: parseInt(process.env.BROWSER_TIMEOUT || "30000"),
    },
    logging: {
      level: (process.env.LOG_LEVEL || "info") as
        | "debug"
        | "info"
        | "warn"
        | "error",
    },
  };
}

// 固定値（SKILL.md から）
export const FIXED_VALUES = {
  // 自社担当者
  companyRepresentative: "代表取締役 今村雄飛",

  // 件名
  invoiceSubject: "Aibee実務活用AIカリキュラム利用料",

  // 品目
  invoiceItem: "Aibee実務活用AIカリキュラム",

  // 単価
  unitPrice: 400000, // 40万円（税込み）

  // 税区分
  taxType: "tax_included", // 内税（固定）

  // freee ログイン情報
  freeeLoginEmail: "accounting@buzzmedia.co.jp",

  // freee URLs
  freeeLoginUrl: "https://accounts.secure.freee.co.jp/login",
  freeeInvoiceUrl: "https://app.secure.freee.co.jp/invoices",
};

// 日付計算ユーティリティ
export function calculateDueDate(baseDate: Date = new Date()): string {
  const date = new Date(baseDate);

  // 翌月の末日を取得
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 2, 0);

  // 土日の場合は前営業日に調整
  let dueDate = nextMonth;
  while (dueDate.getDay() === 0 || dueDate.getDay() === 6) {
    dueDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
  }

  return dueDate.toISOString().split("T")[0]; // YYYY-MM-DD形式
}

export default getConfig();
