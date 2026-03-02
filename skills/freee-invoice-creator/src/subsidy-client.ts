import axios, { AxiosInstance } from "axios";
import type { SubsidyCustomer, SubsidyApplicationData } from "./types";

export class SubsidyClient {
  private client: AxiosInstance;

  constructor(apiKey: string, baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * 顧客情報を検索
   */
  async searchCustomers(query: string): Promise<SubsidyCustomer[]> {
    try {
      const response = await this.client.get(`/customers`, {
        params: {
          search: query,
        },
      });

      return response.data.customers || [];
    } catch (error) {
      console.error("Failed to search customers:", error);
      throw error;
    }
  }

  /**
   * 顧客の詳細情報を取得
   */
  async getCustomer(customerId: string): Promise<SubsidyCustomer> {
    try {
      const response = await this.client.get(`/customers/${customerId}`);
      return response.data.customer;
    } catch (error) {
      console.error("Failed to get customer:", error);
      throw error;
    }
  }

  /**
   * 申請フォームデータを取得
   */
  async getApplicationData(
    customerId: string
  ): Promise<SubsidyApplicationData> {
    try {
      const response = await this.client.get(
        `/customers/${customerId}/applications`
      );

      // 最新の申請データを返す
      const applications = response.data.applications || [];
      if (applications.length === 0) {
        throw new Error("No application data found for this customer");
      }

      return applications[0]; // 最新の申請
    } catch (error) {
      console.error("Failed to get application data:", error);
      throw error;
    }
  }

  /**
   * 顧客情報と申請データを統合して取得
   */
  async getCustomerWithApplication(
    customerId: string
  ): Promise<{
    customer: SubsidyCustomer;
    application: SubsidyApplicationData;
  }> {
    try {
      const [customer, application] = await Promise.all([
        this.getCustomer(customerId),
        this.getApplicationData(customerId),
      ]);

      return { customer, application };
    } catch (error) {
      console.error("Failed to get customer with application:", error);
      throw error;
    }
  }
}
