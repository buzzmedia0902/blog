import type { SubsidyCustomer, SubsidyApplicationData } from "./types";
export declare class SubsidyClient {
    private client;
    constructor(apiKey: string, baseUrl: string);
    /**
     * 顧客情報を検索
     */
    searchCustomers(query: string): Promise<SubsidyCustomer[]>;
    /**
     * 顧客の詳細情報を取得
     */
    getCustomer(customerId: string): Promise<SubsidyCustomer>;
    /**
     * 申請フォームデータを取得
     */
    getApplicationData(customerId: string): Promise<SubsidyApplicationData>;
    /**
     * 顧客情報と申請データを統合して取得
     */
    getCustomerWithApplication(customerId: string): Promise<{
        customer: SubsidyCustomer;
        application: SubsidyApplicationData;
    }>;
}
//# sourceMappingURL=subsidy-client.d.ts.map