import type { FreeeInvoice, FreeePartner, FreeeAccount } from "./types";
export declare class FreeeClient {
    private client;
    private accountId;
    constructor(apiKey: string, accountId: string, baseUrl: string);
    /**
     * 取引先一覧から顧客を検索
     */
    searchPartner(name: string): Promise<FreeePartner | null>;
    /**
     * 取引先の詳細情報を取得
     */
    getPartner(partnerId: number): Promise<FreeePartner>;
    /**
     * 新規取引先を登録
     */
    createPartner(data: {
        name: string;
        email?: string;
        phone?: string;
    }): Promise<FreeePartner>;
    /**
     * 請求書を作成
     */
    createInvoice(invoice: FreeeInvoice): Promise<{
        id: string;
        url: string;
    }>;
    /**
     * 請求書を取得
     */
    getInvoice(invoiceId: string): Promise<FreeeInvoice>;
    /**
     * 請求書をダウンロード（PDF URL取得）
     */
    getInvoicePdfUrl(invoiceId: string): Promise<string>;
    /**
     * 利用可能な自社の担当者一覧を取得
     */
    getCompanyEmployees(): Promise<FreeeAccount[]>;
}
//# sourceMappingURL=freee-client.d.ts.map