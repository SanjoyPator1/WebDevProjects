import * as yup from "yup";

const invoiceLineItemSchema = yup.object().shape({
  item_id: yup.string(),
  name: yup.string().required("Item name is required"),
  rate: yup.number().required("Rate is required").min(0),
  quantity: yup.number().required("Quantity is required").min(0),
  tax_id: yup.string(),
  description: yup.string(),
});

export const invoiceSchema = yup.object().shape({
  customer_id: yup.string().required("Customer ID is required"),
  date: yup.string().required("Date is required"),
  payment_terms: yup.number().min(0),
  payment_terms_label: yup.string(),
  line_items: yup
    .array()
    .of(invoiceLineItemSchema)
    .required("At least one line item is required")
    .min(1, "At least one line item is required"),
  notes: yup.string(),
  terms: yup.string(),
});

export const paymentSchema = yup.object().shape({
  customer_id: yup.string().required("Customer ID is required"),
  payment_mode: yup
    .string()
    .required("Payment mode is required")
    .oneOf(["cash", "cheque", "creditcard", "banktransfer", "others"]),
  amount: yup.number().required("Amount is required").min(0),
  date: yup.string().required("Date is required"),
  reference_number: yup.string(),
  description: yup.string(),
  invoices: yup.array().of(
    yup.object().shape({
      invoice_id: yup.string().required("Invoice ID is required"),
      amount_applied: yup
        .number()
        .required("Amount applied is required")
        .min(0),
    })
  ),
});
