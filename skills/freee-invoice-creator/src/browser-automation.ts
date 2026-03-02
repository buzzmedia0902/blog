import { chromium, type Page, type Browser } from "playwright";
import { FIXED_VALUES } from "./config";

export class BrowserAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private timeout: number;
  private headless: boolean;

  constructor(options: { timeout: number; headless: boolean }) {
    this.timeout = options.timeout;
    this.headless = options.headless;
  }

  /**
   * ブラウザを起動
   */
  async launch(): Promise<void> {
    this.browser = await chromium.launch({
      headless: this.headless,
    });

    const context = await this.browser.newContext();
    this.page = await context.newPage();
    this.page.setDefaultTimeout(this.timeout);
  }

  /**
   * ブラウザを終了
   */
  async close(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * freee にログイン
   */
  async loginToFreee(email: string, password: string): Promise<void> {
    if (!this.page) throw new Error("Browser not initialized");

    // ログインページに移動
    await this.page.goto(FIXED_VALUES.freeeLoginUrl);

    // メールアドレスを入力
    await this.page.fill('input[type="email"]', email);

    // 次へボタンをクリック
    await this.page.click('button:has-text("次へ")');

    // パスワードを入力
    await this.page.fill('input[type="password"]', password);

    // ログインボタンをクリック
    await this.page.click('button:has-text("ログイン")');

    // ダッシュボードが表示されるまで待機
    await this.page.waitForURL("**/dashboard");
  }

  /**
   * 請求書作成ページに移動
   */
  async navigateToInvoiceCreation(): Promise<void> {
    if (!this.page) throw new Error("Browser not initialized");

    // 請求書メニューを表示
    await this.page.hover('button:has-text("請求入金")');

    // 請求書を選択
    await this.page.click('a:has-text("請求書")');

    // 新規作成ボタンをクリック
    await this.page.waitForSelector('button:has-text("プラス新規作成")');
    await this.page.click('button:has-text("プラス新規作成")');
  }

  /**
   * 取引先を検索・選択
   */
  async selectPartner(partnerName: string): Promise<void> {
    if (!this.page) throw new Error("Browser not initialized");

    // 取引先入力欄に入力
    const partnerInput = await this.page.locator(
      'input[placeholder*="取引先"]'
    );
    await partnerInput.fill(partnerName);

    // ドロップダウンから選択
    await this.page.waitForSelector(`text=${partnerName}`);
    await this.page.click(`text=${partnerName}`);
  }

  /**
   * 請求書の基本情報を入力
   */
  async fillInvoiceBasicInfo(data: {
    invoiceDate: string;
    dueDate: string;
    subject: string;
  }): Promise<void> {
    if (!this.page) throw new Error("Browser not initialized");

    // ページを上にスクロール
    await this.page.evaluate(() => window.scrollTo(0, 0));

    // 請求日を入力
    const invoiceDateInput = await this.page.locator(
      'input[placeholder*="請求日"]'
    );
    await invoiceDateInput.fill(data.invoiceDate);

    // 入金期日を入力
    const dueDateInput = await this.page.locator(
      'input[placeholder*="入金期日"]'
    );
    await dueDateInput.fill(data.dueDate);

    // 件名を入力
    const subjectInput = await this.page.locator(
      'input[placeholder*="件名"]'
    );
    // Ctrl+A で全選択して削除（自動補完機能対策）
    await subjectInput.click();
    await this.page.keyboard.press("Control+A");
    await this.page.keyboard.press("Delete");
    await subjectInput.type(data.subject);
  }

  /**
   * 自社担当者を選択
   */
  async selectCompanyRepresentative(
    representativeName: string
  ): Promise<void> {
    if (!this.page) throw new Error("Browser not initialized");

    const repInput = await this.page.locator(
      'input[placeholder*="担当者"]'
    );
    await repInput.click();
    await this.page.keyboard.press("Control+A");
    await this.page.keyboard.press("Delete");
    await repInput.type(representativeName);

    // ドロップダウンから選択
    await this.page.waitForSelector(`text=${representativeName}`);
    await this.page.click(`text=${representativeName}`);
  }

  /**
   * 請求書明細を入力
   */
  async fillInvoiceDetails(data: {
    description: string;
    quantity: number;
    unitPrice: number;
  }): Promise<void> {
    if (!this.page) throw new Error("Browser not initialized");

    // ページを下にスクロール
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 摘要を入力
    const descInput = await this.page.locator(
      'input[placeholder*="摘要"]'
    );
    await descInput.fill(data.description);

    // 数量を入力（特殊な手順が必要）
    const quantityInput = await this.page.locator(
      'input[placeholder*="数量"]'
    );
    await quantityInput.click();
    await this.page.keyboard.press("Control+A");
    await this.page.keyboard.press("Delete");

    // キー入力で数量を入力
    await this.page.keyboard.type(data.quantity.toString());

    // 別の入力欄に移動してフォーカスを外す
    await this.page.keyboard.press("Tab");

    // 単位を確認
    const unitSelect = await this.page.locator(
      'select[name*="unit"]'
    );
    if (await unitSelect.isVisible()) {
      await unitSelect.selectOption("名");
    }

    // 単価は自動計算されるため、確認のみ
    await this.page.waitForTimeout(1000);
  }

  /**
   * 税区分を「内税」に設定
   */
  async setTaxTypeToInclusive(): Promise<void> {
    if (!this.page) throw new Error("Browser not initialized");

    // 課税・表示設定ボタンをクリック
    await this.page.click('button:has-text("課税・表示設定")');

    // ダイアログが表示されるまで待機
    await this.page.waitForSelector('text="消費税"');

    // 「税込表示（内税）」ラジオボタンをクリック
    await this.page.click('input[value="tax_included"]');

    // 保存ボタンをクリック
    await this.page.click('button:has-text("保存")');

    // ダイアログが閉じるまで待機
    await this.page.waitForTimeout(1000);
  }

  /**
   * 請求書を保存
   */
  async saveInvoice(): Promise<string> {
    if (!this.page) throw new Error("Browser not initialized");

    // 保存ボタンをクリック
    await this.page.click('button:has-text("保存")');

    // 保存完了を待機（URL変更を確認）
    await this.page.waitForURL(/\/invoices\/\d+/);

    // 現在のURLから請求書IDを抽出
    const url = this.page.url();
    const match = url.match(/\/invoices\/(\d+)/);
    const invoiceId = match ? match[1] : "";

    return invoiceId;
  }

  /**
   * PDFをダウンロード
   */
  async downloadPdf(): Promise<string> {
    if (!this.page) throw new Error("Browser not initialized");

    // ダウンロードボタンをクリック
    const downloadPromise = this.page.waitForEvent("download");
    await this.page.click('button:has-text("ダウンロード")');

    // 「PDFダウンロード」を選択
    await this.page.click('text="PDFダウンロード"');

    // ダウンロード完了を待機
    const download = await downloadPromise;
    const path = await download.path();

    return path || "";
  }

  /**
   * スクリーンショットを取得（デバッグ用）
   */
  async takeScreenshot(filename: string): Promise<void> {
    if (!this.page) throw new Error("Browser not initialized");

    await this.page.screenshot({ path: filename });
  }
}
