import "dotenv/config";
import type { Config } from "./types";
export declare function getConfig(): Config;
export declare const FIXED_VALUES: {
    companyRepresentative: string;
    invoiceSubject: string;
    invoiceItem: string;
    unitPrice: number;
    taxType: string;
    freeeLoginEmail: string;
    freeeLoginUrl: string;
    freeeInvoiceUrl: string;
};
export declare function calculateDueDate(baseDate?: Date): string;
declare const _default: Config;
export default _default;
//# sourceMappingURL=config.d.ts.map