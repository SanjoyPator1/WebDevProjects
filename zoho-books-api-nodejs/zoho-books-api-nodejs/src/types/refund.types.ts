export interface RefundBase {
  date: string;
  refund_mode: "cash" | "cheque" | "creditcard" | "banktransfer" | "others";
  reference_number?: string;
  amount: number;
  description?: string;
  exchange_rate?: number;
  bank_charges?: number;
}

export interface CustomerRefund extends RefundBase {
  customer_id: string;
  payment_id: string;
  account_id?: string;
}

export interface RefundListParams {
  page?: number;
  per_page?: number;
  sort_column?: "date" | "refund_mode" | "reference_number" | "amount";
  sort_order?: "asc" | "desc";
}

export interface RefundResponse {
  code: number;
  message: string;
  refund?: {
    refund_id: string;
    customer_id: string;
    customer_name: string;
    date: string;
    refund_mode: string;
    reference_number: string;
    amount: number;
    description: string;
    exchange_rate: number;
    currency_id: string;
    currency_code: string;
    created_time: string;
    status: string;
  };
}
