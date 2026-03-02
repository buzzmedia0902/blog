export declare class BrowserAutomation {
    private browser;
    private page;
    private timeout;
    private headless;
    constructor(options: {
        timeout: number;
        headless: boolean;
    });
    /**
     * ブラウザを起動
     */
    launch(): Promise<void>;
    /**
     * ブラウザを終了
     */
    close(): Promise<void>;
    /**
     * freee にログイン
     */
    loginToFreee(email: string, password: string): Promise<void>;
    /**
     * 請求書作成ページに移動
     */
    navigateToInvoiceCreation(): Promise<void>;
    /**
     * 取引先を検索・選択
     */
    selectPartner(partnerName: string): Promise<void>;
    /**
     * 請求書の基本情報を入力
     */
    fillInvoiceBasicInfo(data: {
        invoiceDate: string;
        dueDate: string;
        subject: string;
    }): Promise<void>;
    /**
     * 自社担当者を選択
     */
    selectCompanyRepresentative(representativeName: string): Promise<void>;
    /**
     * 請求書明細を入力
     */
    fillInvoiceDetails(data: {
        description: string;
        quantity: number;
        unitPrice: number;
    }): Promise<void>;
    /**
     * 税区分を「内税」に設定
     */
    setTaxTypeToInclusive(): Promise<void>;
    /**
     * 請求書を保存
     */
    saveInvoice(): Promise<string>;
    /**
     * PDFをダウンロード
     */
    downloadPdf(): Promise<string>;
    /**
     * スクリーンショットを取得（デバッグ用）
     */
    takeScreenshot(filename: string): Promise<void>;
}
//# sourceMappingURL=browser-automation.d.ts.map