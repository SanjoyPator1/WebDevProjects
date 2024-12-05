export interface ContactAddress {
  attention?: string;
  address?: string;
  street2?: string;
  state_code?: string;
  city?: string;
  state?: string;
  zip?: string | number;
  country?: string;
  fax?: string;
  phone?: string;
}

export interface ContactPerson {
  contact_person_id?: string;
  salutation?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  designation?: string;
  department?: string;
  skype?: string;
  is_primary_contact?: boolean;
  enable_portal?: boolean;
}

export interface DefaultTemplates {
  invoice_template_id?: string;
  estimate_template_id?: string;
  creditnote_template_id?: string;
  purchaseorder_template_id?: string;
  salesorder_template_id?: string;
  retainerinvoice_template_id?: string;
  paymentthankyou_template_id?: string;
  retainerinvoice_paymentthankyou_template_id?: string;
  invoice_email_template_id?: string;
  estimate_email_template_id?: string;
  creditnote_email_template_id?: string;
  purchaseorder_email_template_id?: string;
  salesorder_email_template_id?: string;
  retainerinvoice_email_template_id?: string;
  paymentthankyou_email_template_id?: string;
  retainerinvoice_paymentthankyou_email_template_id?: string;
}

export interface CustomField {
  index: number;
  value: string;
  label?: string;
}

export interface ContactData {
  contact_name: string; // Required
  company_name?: string;
  website?: string;
  language_code?: string;
  contact_type: "customer" | "vendor"; // Required
  customer_sub_type?: "business" | "individual";
  credit_limit?: number;
  currency_id?: string;
  payment_terms?: number;
  payment_terms_label?: string;
  notes?: string;
  billing_address?: ContactAddress;
  shipping_address?: ContactAddress;
  contact_persons?: ContactPerson[];
  default_templates?: DefaultTemplates;
  custom_fields?: CustomField[];
  opening_balance_amount?: number;
  exchange_rate?: number;
  facebook?: string;
  twitter?: string;
  tax_exemption_id?: string;
  tax_exemption_code?: string;
  tax_authority_id?: string;
  tax_id?: string;
  is_taxable?: boolean;
  place_of_contact?: string;
  gst_no?: string;
  gst_treatment?: "business_gst" | "business_none" | "overseas" | "consumer";
  tax_treatment?: string;
  tax_regime?: string;
  owner_id?: string;
}

export interface LineItem {
  item_id?: string;
  name?: string;
  description?: string;
  rate: number;
  quantity: number;
  unit?: string;
  tax_id?: string;
  tax_name?: string;
  tax_percentage?: number;
}

export interface CreditNoteData {
  customer_id: string;
  credit_note_number?: string;
  reference_number?: string;
  date: string;
  exchange_rate?: number;
  currency_id?: string;
  currency_code?: string;
  line_items: LineItem[];
  notes?: string;
  terms?: string;
}

export interface RefundData {
  customer_id: string;
  date: string;
  refund_mode: "cash" | "cheque" | "creditcard" | "banktransfer" | "others";
  reference_number?: string;
  amount: number;
  description?: string;
  exchange_rate?: number;
  bank_charges?: number;
}
