import axios from "axios";
export class FreeeClient {
    constructor(apiKey, accountId, baseUrl) {
        this.accountId = accountId;
        this.client = axios.create({
            baseURL: baseUrl,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });
    }
    /**
     * 取引先一覧から顧客を検索
     */
    async searchPartner(name) {
        try {
            const response = await this.client.get(`/partners`, {
                params: {
                    account_id: this.accountId,
                    name,
                },
            });
            const partners = response.data.partners || [];
            if (partners.length === 0) {
                return null;
            }
            // 完全一致を優先、なければ部分一致の最初を返す
            const exactMatch = partners.find((p) => p.name === name);
            return exactMatch || partners[0];
        }
        catch (error) {
            console.error("Failed to search partner:", error);
            throw error;
        }
    }
    /**
     * 取引先の詳細情報を取得
     */
    async getPartner(partnerId) {
        try {
            const response = await this.client.get(`/partners/${partnerId}`, {
                params: {
                    account_id: this.accountId,
                },
            });
            return response.data.partner;
        }
        catch (error) {
            console.error("Failed to get partner:", error);
            throw error;
        }
    }
    /**
     * 新規取引先を登録
     */
    async createPartner(data) {
        try {
            const response = await this.client.post(`/partners`, {
                partner: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    account_id: this.accountId,
                },
            });
            return response.data.partner;
        }
        catch (error) {
            console.error("Failed to create partner:", error);
            throw error;
        }
    }
    /**
     * 請求書を作成
     */
    async createInvoice(invoice) {
        try {
            const response = await this.client.post(`/invoices`, {
                invoice: {
                    account_id: this.accountId,
                    issue_date: invoice.issueDate,
                    due_date: invoice.dueDate,
                    subject: invoice.subject,
                    partner_code: invoice.partnerCode,
                    partner_name: invoice.partnerName,
                    invoice_details: invoice.details.map((detail) => ({
                        description: detail.description,
                        quantity: detail.quantity,
                        unit_price: detail.unitPrice,
                        unit: detail.unit,
                        tax_type: detail.taxType,
                    })),
                },
            });
            return {
                id: response.data.invoice.id,
                url: response.data.invoice.invoice_url || "",
            };
        }
        catch (error) {
            console.error("Failed to create invoice:", error);
            throw error;
        }
    }
    /**
     * 請求書を取得
     */
    async getInvoice(invoiceId) {
        try {
            const response = await this.client.get(`/invoices/${invoiceId}`, {
                params: {
                    account_id: this.accountId,
                },
            });
            const inv = response.data.invoice;
            return {
                id: inv.id,
                issueDate: inv.issue_date,
                dueDate: inv.due_date,
                subject: inv.subject,
                partnerName: inv.partner_name,
                details: (inv.invoice_details || []).map((d) => ({
                    description: d.description,
                    quantity: d.quantity,
                    unitPrice: d.unit_price,
                    unit: d.unit,
                    taxType: d.tax_type,
                })),
            };
        }
        catch (error) {
            console.error("Failed to get invoice:", error);
            throw error;
        }
    }
    /**
     * 請求書をダウンロード（PDF URL取得）
     */
    async getInvoicePdfUrl(invoiceId) {
        try {
            const response = await this.client.get(`/invoices/${invoiceId}`, {
                params: {
                    account_id: this.accountId,
                },
            });
            // PDFダウンロードURLを構成
            const downloadToken = response.data.invoice.download_token;
            return `${this.client.defaults.baseURL}/invoices/${invoiceId}/pdf?account_id=${this.accountId}&token=${downloadToken}`;
        }
        catch (error) {
            console.error("Failed to get invoice PDF URL:", error);
            throw error;
        }
    }
    /**
     * 利用可能な自社の担当者一覧を取得
     */
    async getCompanyEmployees() {
        try {
            const response = await this.client.get(`/companies`, {
                params: {
                    account_id: this.accountId,
                },
            });
            return response.data.companies || [];
        }
        catch (error) {
            console.error("Failed to get company info:", error);
            throw error;
        }
    }
}
//# sourceMappingURL=freee-client.js.map