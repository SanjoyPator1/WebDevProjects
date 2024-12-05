import * as yup from "yup";

export const refundSchema = yup.object().shape({
  customer_id: yup.string().required("Customer ID is required"),
  payment_id: yup.string().required("Payment ID is required"),
  date: yup.string().required("Date is required"),
  refund_mode: yup
    .string()
    .required("Refund mode is required")
    .oneOf(["cash", "cheque", "creditcard", "banktransfer", "others"]),
  reference_number: yup.string(),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  description: yup.string(),
  exchange_rate: yup.number().positive("Exchange rate must be positive"),
  bank_charges: yup.number().min(0, "Bank charges cannot be negative"),
  account_id: yup.string(),
});
