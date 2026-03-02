import { getConfig, FIXED_VALUES, calculateDueDate } from "./config";
import { FreeeClient } from "./freee-client";
import { SubsidyClient } from "./subsidy-client";
import { BrowserAutomation } from "./browser-automation";
class FreeeInvoiceCreatorMCP {
    constructor() {
        this.config = getConfig();
        this.freeeClient = new FreeeClient(this.config.freee.apiKey, this.config.freee.accountId, this.config.freee.baseUrl);
        this.subsidyClient = new SubsidyClient(this.config.subsidy.apiKey, this.config.subsidy.baseUrl);
        this.browser = new BrowserAutomation({
            timeout: this.config.browser.timeout,
            headless: this.config.browser.headless,
        });
    }
    /**
     * メイン：請求書を作成
     */
    async createInvoice(request) {
        try {
            console.log("📝 請求書作成を開始します");
            // ステップ1: 顧客情報を取得
            console.log("📋 ステップ1: 顧客情報を取得中...");
            let customerName = request.customerName;
            let representativeName = request.representativeName;
            if (request.customerId && !customerName) {
                const data = await this.subsidyClient.getCustomerWithApplication(request.customerId);
                customerName = data.customer.companyName;
                representativeName = data.customer.representativeName;
            }
            if (!customerName) {
                throw new Error("顧客情報が不足しています");
            }
            // ステップ2: freeeで取引先を確認
            console.log("🔍 ステップ2: freeeで取引先を確認中...");
            let partner = await this.freeeClient.searchPartner(customerName);
            if (!partner) {
                console.log("📌 新規取引先を作成します");
                partner = await this.freeeClient.createPartner({
                    name: customerName,
                });
            }
            // ステップ3: 請求書データを準備
            console.log("📊 ステップ3: 請求書データを準備中...");
            const invoiceDate = request.invoiceDate || new Date().toISOString().split("T")[0];
            const dueDate = request.dueDate || calculateDueDate();
            const invoice = {
                issueDate: invoiceDate,
                dueDate,
                subject: FIXED_VALUES.invoiceSubject,
                partnerName: customerName,
                partnerCode: partner.code,
                details: [
                    {
                        description: FIXED_VALUES.invoiceItem,
                        quantity: request.trainingParticipants,
                        unitPrice: FIXED_VALUES.unitPrice,
                        unit: "名",
                        taxType: "tax_included",
                    },
                ],
            };
            // ステップ4: API経由で請求書を作成
            console.log("🌐 ステップ4: freee APIで請求書を作成中...");
            const createdInvoice = await this.freeeClient.createInvoice(invoice);
            // ステップ5: ブラウザでPDFをダウンロード（オプション）
            let pdfPath = "";
            try {
                console.log("🌐 ステップ5: PDFをダウンロード中...");
                await this.browser.launch();
                // 自動化ログイン（本番環境ではトークン認証を使用）
                // await this.browser.loginToFreee(email, password);
                // await this.browser.navigateToInvoiceCreation();
                // pdfPath = await this.browser.downloadPdf();
                console.log("✅ PDFダウンロードスキップ（API認証で対応）");
            }
            catch (error) {
                console.warn("⚠️ PDFダウンロードエラー:", error);
            }
            finally {
                await this.browser.close();
            }
            return {
                success: true,
                invoiceId: createdInvoice.id,
                pdfUrl: createdInvoice.url,
                errorMessage: undefined,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("❌ エラー:", errorMessage);
            return {
                success: false,
                errorMessage,
                debugInfo: {
                    timestamp: new Date().toISOString(),
                    error: String(error),
                },
            };
        }
    }
    /**
     * 顧客情報を検索
     */
    async searchCustomer(query) {
        try {
            const customers = await this.subsidyClient.searchCustomers(query);
            return {
                success: true,
                data: customers,
            };
        }
        catch (error) {
            return {
                success: false,
                error: String(error),
            };
        }
    }
    /**
     * 顧客の詳細情報を取得
     */
    async getCustomer(customerId) {
        try {
            const { customer, application } = await this.subsidyClient.getCustomerWithApplication(customerId);
            return {
                success: true,
                data: {
                    customer,
                    application,
                    suggestedInvoiceData: {
                        trainingParticipants: application.trainingParticipants,
                        trainingDate: application.trainingDate,
                    },
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: String(error),
            };
        }
    }
}
// エクスポート
export const createMCPServer = () => {
    return new FreeeInvoiceCreatorMCP();
};
export { FreeeInvoiceCreatorMCP };
// スタンドアロンで実行された場合のテスト
if (import.meta.url === `file://${process.argv[1]}`) {
    const mcp = new FreeeInvoiceCreatorMCP();
    console.log("🚀 freee 請求書作成 MCP サーバーが起動しました");
    console.log("このサーバーはClaudeのMCPプロトコルで通信します");
}
//# sourceMappingURL=mcp-server.js.map