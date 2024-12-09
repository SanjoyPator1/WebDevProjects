// src/validations/contact.schema.ts

import * as yup from "yup";

const phoneRegExp = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

const contactAddressSchema = yup.object().shape({
  attention: yup.string().max(100),
  address: yup.string().max(500),
  street2: yup.string().max(500),
  state_code: yup.string().max(30),
  city: yup.string().max(100),
  state: yup.string().max(100),
  zip: yup
    .mixed()
    .test(
      "isValidZip",
      "Zip must be either string or number",
      (value) =>
        !value || typeof value === "string" || typeof value === "number"
    ),
  country: yup.string().max(100),
  fax: yup.string().matches(phoneRegExp, "Invalid fax number"),
  phone: yup.string().matches(phoneRegExp, "Invalid phone number"),
});

const contactPersonSchema = yup.object().shape({
  salutation: yup.string().max(10),
  first_name: yup.string().max(100),
  last_name: yup.string().max(100),
  email: yup.string().email("Invalid email format").max(100),
  phone: yup.string().matches(phoneRegExp, "Invalid phone number"),
  mobile: yup.string().matches(phoneRegExp, "Invalid mobile number"),
  designation: yup.string().max(100),
  department: yup.string().max(100),
  skype: yup.string().max(100),
  is_primary_contact: yup.boolean(),
  enable_portal: yup.boolean(),
});

const customFieldSchema = yup.object().shape({
  index: yup.number().required("Index is required"),
  value: yup.string().required("Value is required"),
  label: yup.string(),
});

export const contactSchema = yup.object().shape({
  contact_name: yup.string().required("Contact name is required").max(200),
  company_name: yup.string().max(200),
  website: yup.string().url("Invalid website URL"),
  language_code: yup
    .string()
    .oneOf([
      "de",
      "en",
      "es",
      "fr",
      "it",
      "ja",
      "nl",
      "pt",
      "pt_br",
      "sv",
      "zh",
      "en_gb",
    ]),
  contact_type: yup
    .string()
    .required("Contact type is required")
    .oneOf(["customer", "vendor"]),
  customer_sub_type: yup.string().oneOf(["business", "individual"]),
  credit_limit: yup.number().positive("Credit limit must be positive"),
  currency_id: yup.string(),
  payment_terms: yup
    .number()
    .integer("Payment terms must be an integer")
    .min(0),
  payment_terms_label: yup.string(),
  notes: yup.string(),

  billing_address: contactAddressSchema,
  shipping_address: contactAddressSchema,
  contact_persons: yup.array().of(contactPersonSchema),
  custom_fields: yup.array().of(customFieldSchema),

  opening_balance_amount: yup.number(),
  exchange_rate: yup.number().positive("Exchange rate must be positive"),

  facebook: yup.string().max(100),
  twitter: yup.string().max(100),

  tax_exemption_id: yup.string(),
  tax_exemption_code: yup.string(),
  tax_authority_id: yup.string(),
  tax_id: yup.string(),
  is_taxable: yup.boolean(),

  place_of_contact: yup.string(),
  gst_no: yup
    .string()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number"
    ),
  gst_treatment: yup
    .string()
    .oneOf(["business_gst", "business_none", "overseas", "consumer"]),
  tax_treatment: yup.string(),
  tax_regime: yup.string(),
  owner_id: yup.string(),
});

// Email validation schema
export const contactEmailSchema = yup.object().shape({
  to_mail_ids: yup
    .array()
    .of(yup.string().email("Invalid email address"))
    .min(1, "At least one recipient email is required"),
  subject: yup
    .string()
    .required("Subject is required")
    .max(1000, "Subject must not exceed 1000 characters"),
  body: yup
    .string()
    .required("Email body is required")
    .max(5000, "Email body must not exceed 5000 characters"),
});

// Statement email validation schema
export const statementEmailSchema = yup.object().shape({
  send_from_org_email_id: yup.boolean(),
  to_mail_ids: yup
    .array()
    .of(yup.string().email("Invalid email address"))
    .min(1, "At least one recipient email is required"),
  cc_mail_ids: yup.array().of(yup.string().email("Invalid email address")),
  subject: yup
    .string()
    .required("Subject is required")
    .max(1000, "Subject must not exceed 1000 characters"),
  body: yup
    .string()
    .required("Email body is required")
    .max(5000, "Email body must not exceed 5000 characters"),
});

export const portalAccessSchema = yup.object({
  contact_persons: yup
    .array()
    .of(
      yup.object({
        contact_person_id: yup
          .string()
          .required("Contact person ID is required"),
      })
    )
    .required("At least one contact person is required")
    .min(1),
});
