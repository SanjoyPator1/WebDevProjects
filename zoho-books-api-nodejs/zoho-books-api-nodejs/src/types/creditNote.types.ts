export interface CreditNoteLineItem {
  name: string;
  rate: number;
  quantity: number;
  description?: string;
  item_id?: string;
  tax_id?: string;
  tax_name?: string;
  tax_percentage?: number;
}

export interface CreditNoteData {
  customer_id: string;
  creditnote_number?: string;
  reference_number?: string;
  date: string;
  exchange_rate?: number;
  currency_id?: string;
  currency_code?: string;
  line_items: CreditNoteLineItem[];
  notes?: string;
  terms?: string;
}

export interface CreditNoteRefundData {
  date: string;
  refund_mode: "cash" | "cheque" | "creditcard" | "banktransfer" | "others";
  reference_number?: string;
  amount: number;
  description?: string;
  exchange_rate?: number;
  bank_charges?: number;
}
