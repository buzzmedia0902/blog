// ==================== freee API Types ====================

export interface FreeeInvoice {
  id?: number;
  issueDate: string;
  dueDate: string;
  subject: string;
  details: FreeeInvoiceDetail[];
  partnerName: string;
  partnerCode?: string;
}

export interface FreeeInvoiceDetail {
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  taxType: "tax_excluded" | "tax_included"; // 外税 | 内税
}

export interface FreeePartner {
  id: number;
  code: string;
  name: string;
  nameKana?: string;
  defaultTitle?: string;
  zipCode?: string;
  prefectureCode?: number;
  address?: string;
  addressKana?: string;
  phone?: string;
  email?: string;
}

export interface FreeeAccount {
  id: number;
  name: string;
  code: string;
}

// ==================== Subsidy System Types ====================

export interface SubsidyCustomer {
  id: string;
  companyName: string;
  representativeName: string;
  address?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
}

export interface SubsidyApplicationData {
  applicationId: string;
  customerId: string;
  trainingDate: string;
  trainingParticipants: number;
  status: "pending" | "approved" | "rejected";
}

// ==================== Invoice Creation Request ====================

export interface InvoiceCreationRequest {
  customerId?: string;
  customerName?: string;
  representativeName?: string;
  trainingDate: string;
  trainingParticipants: number;
  invoiceDate?: string;
  dueDate?: string;
}

export interface InvoiceCreationResult {
  success: boolean;
  invoiceId?: string;
  pdfUrl?: string;
  errorMessage?: string;
  debugInfo?: Record<string, unknown>;
}

// ==================== Browser Automation Types ====================

export interface BrowserContext {
  page?: any; // Playwright Page
  isLoggedIn: boolean;
  currentUrl?: string;
}

export interface FormInputData {
  selector: string;
  value: string;
  type: "text" | "select" | "checkbox" | "date";
  waitForSelector?: boolean;
  clearFirst?: boolean;
}

// ==================== Configuration Types ====================

export interface Config {
  freee: {
    apiKey: string;
    accountId: string;
    baseUrl: string;
  };
  subsidy: {
    apiKey: string;
    baseUrl: string;
  };
  browser: {
    headless: boolean;
    timeout: number;
  };
  logging: {
    level: "debug" | "info" | "warn" | "error";
  };
}

export interface Logger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, error?: unknown): void;
}
