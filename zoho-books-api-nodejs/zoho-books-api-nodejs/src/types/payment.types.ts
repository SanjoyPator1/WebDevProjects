export interface CustomerPaymentData {
  customer_id: string;
  payment_mode: "cash" | "cheque" | "creditcard" | "banktransfer" | "others";
  amount: number;
  date: string;
  reference_number?: string;
  description?: string;
  exchange_rate?: number;
  bank_charges?: number;
  account_id?: string;
  invoices?: Array<{
    invoice_id: string;
    amount_applied: number;
  }>;
}

export interface CustomerRefundData {
  customer_id: string;
  date: string;
  refund_mode: "cash" | "cheque" | "creditcard" | "banktransfer" | "others";
  reference_number?: string;
  amount: number;
  payment_id: string; // ID of the payment being refunded
  description?: string;
  exchange_rate?: number;
  bank_charges?: number;
  account_id?: string;
}

export interface InvoiceLineItem {
  item_id?: string;
  name: string;
  rate: number;
  quantity: number;
  tax_id?: string;
  description?: string;
}

export interface InvoiceData {
  customer_id: string;
  date: string;
  payment_terms?: number;
  payment_terms_label?: string;
  line_items: InvoiceLineItem[];
  notes?: string;
  terms?: string;
}

export interface PaymentData {
  customer_id: string;
  payment_mode: "cash" | "cheque" | "creditcard" | "banktransfer" | "others";
  amount: number;
  date: string;
  reference_number?: string;
  description?: string;
  invoices?: Array<{
    invoice_id: string;
    amount_applied: number;
  }>;
}
