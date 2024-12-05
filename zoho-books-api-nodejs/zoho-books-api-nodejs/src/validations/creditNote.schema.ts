import * as yup from "yup";

const creditNoteLineItemSchema = yup.object().shape({
  name: yup.string().required("Item name is required"),
  rate: yup
    .number()
    .required("Rate is required")
    .min(0, "Rate must be non-negative"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .min(0, "Quantity must be non-negative"),
  description: yup.string(),
  item_id: yup.string(),
  tax_id: yup.string(),
  tax_name: yup.string(),
  tax_percentage: yup.number().min(0, "Tax percentage must be non-negative"),
});

export const creditNoteSchema = yup.object().shape({
  customer_id: yup.string().required("Customer ID is required"),
  creditnote_number: yup.string(),
  reference_number: yup.string(),
  date: yup.string().required("Date is required"),
  exchange_rate: yup.number().positive("Exchange rate must be positive"),
  currency_id: yup.string(),
  currency_code: yup.string(),
  line_items: yup
    .array()
    .of(creditNoteLineItemSchema)
    .required("At least one line item is required")
    .min(1, "At least one line item is required"),
  notes: yup.string(),
  terms: yup.string(),
});

export const creditNoteRefundSchema = yup.object().shape({
  date: yup.string().required("Date is required"),
  refund_mode: yup
    .string()
    .required("Refund mode is required")
    .oneOf(
      ["cash", "cheque", "creditcard", "banktransfer", "others"],
      "Invalid refund mode"
    ),
  reference_number: yup.string(),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  description: yup.string(),
  exchange_rate: yup.number().positive("Exchange rate must be positive"),
  bank_charges: yup.number().min(0, "Bank charges must be non-negative"),
});
