import type { InvoiceCreationRequest, InvoiceCreationResult } from "./types";
declare class FreeeInvoiceCreatorMCP {
    private config;
    private freeeClient;
    private subsidyClient;
    private browser;
    constructor();
    /**
     * メイン：請求書を作成
     */
    createInvoice(request: InvoiceCreationRequest): Promise<InvoiceCreationResult>;
    /**
     * 顧客情報を検索
     */
    searchCustomer(query: string): Promise<{
        success: boolean;
        data: import("./types").SubsidyCustomer[];
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    /**
     * 顧客の詳細情報を取得
     */
    getCustomer(customerId: string): Promise<{
        success: boolean;
        data: {
            customer: import("./types").SubsidyCustomer;
            application: import("./types").SubsidyApplicationData;
            suggestedInvoiceData: {
                trainingParticipants: number;
                trainingDate: string;
            };
        };
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
}
export declare const createMCPServer: () => FreeeInvoiceCreatorMCP;
export { FreeeInvoiceCreatorMCP };
//# sourceMappingURL=mcp-server.d.ts.map