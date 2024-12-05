export type AsyncRequestHandler = (
  req: Request,
  res: Response
) => Promise<Response | void> | void;

import { ContactData } from "@/types/contacts.types";
import { CustomerRefund, RefundListParams } from "@/types/refund.types";
import { ContactSearchParams } from "@/types/zoho.types";
import { refundSchema } from "../validations/refund.schema";
import axios from "axios";
import { Request, Response } from "express";
import config from "../config";
import { createZohoClient, getAuthUrl } from "../lib/zoho-client";
import { contactSchema } from "../validations/contact.schema";
import { getStoredRefreshToken } from "./token.controller";
import { InvoiceData, PaymentData } from "@/types/payment.types";
import { invoiceSchema, paymentSchema } from "../validations/payment.schema";
import { CreditNoteData, CreditNoteRefundData } from "@/types/creditNote.types";
import {
  creditNoteRefundSchema,
  creditNoteSchema,
} from "../validations/creditNote.schema";

class ZohoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZohoError";
  }
}

// Helper to check refresh token and create client
const getZohoClient = async () => {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    throw new ZohoError("No refresh token available");
  }
  return createZohoClient(config.zoho, undefined, refreshToken);
};

// Helper function to handle errors
const handleError = (error: unknown, res: Response): void => {
  if (axios.isAxiosError(error)) {
    // Handle Zoho API specific errors
    const zohoError = error.response?.data;
    if (zohoError && zohoError.code && zohoError.message) {
      res.status(error.response?.status || 500).json({
        code: zohoError.code,
        message: zohoError.message,
      });
      return;
    }
    // Handle other Axios errors
    res.status(error.response?.status || 500).json({
      code: error.response?.status || 500,
      message: error.message,
    });
  } else if (error instanceof ZohoError || error instanceof Error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  } else {
    res.status(500).json({
      code: 500,
      message: "An unknown error occurred",
    });
  }
};

export const getAuthUrlController = (req: Request, res: Response): void => {
  try {
    const authUrl = getAuthUrl(config.zoho);
    res.json({ authUrl });
  } catch (error) {
    handleError(error, res);
  }
};

export const handleGrantToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { grantToken } = req.body;

    if (!grantToken) {
      res.status(400).json({ error: "Grant token is required" });
      return;
    }

    const zoho = await createZohoClient(config.zoho, grantToken);
    const refreshToken = (zoho as any)["authManager"].getRefreshToken();

    if (!refreshToken) {
      res.status(400).json({ error: "Failed to get refresh token" });
      return;
    }

    // Make a request to the token controller to store the refresh token
    const response = await fetch(
      `${req.protocol}://${req.get("host")}/token/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      res.status(400).json({ error: "Failed to store refresh token" });
      return;
    }

    res.json({ success: true, refreshToken });
  } catch (error) {
    handleError(error, res);
  }
};

export const getOrganizations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const zoho = await getZohoClient();
    const organizations = await zoho.getOrganizations();
    res.json(organizations);
  } catch (error) {
    handleError(error, res);
  }
};

// ----- GET Contacts zohobooks section -------

export const getContacts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 200;

    const zoho = await getZohoClient();
    const contacts = await zoho.getContacts(page, perPage);
    res.json(contacts);
  } catch (error) {
    handleError(error, res);
  }
};

export const getContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { contactId } = req.params;
    if (!contactId) {
      res.status(400).json({ error: "Contact ID is required" });
      return;
    }

    const zoho = await getZohoClient();
    const contact = await zoho.getContact(contactId);
    res.json(contact);
  } catch (error) {
    handleError(error, res);
  }
};

export const getContactAddresses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { contactId } = req.params;
    if (!contactId) {
      res.status(400).json({ error: "Contact ID is required" });
      return;
    }

    const zoho = await getZohoClient();
    const addresses = await zoho.getContactAddresses(contactId);
    res.json(addresses);
  } catch (error) {
    handleError(error, res);
  }
};

export const getContactComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { contactId } = req.params;
    if (!contactId) {
      res.status(400).json({ error: "Contact ID is required" });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 200;

    const zoho = await getZohoClient();
    const comments = await zoho.getContactComments(contactId, {
      page,
      per_page: perPage,
    });
    res.json(comments);
  } catch (error) {
    handleError(error, res);
  }
};

export const getContactRefunds = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { contactId } = req.params;
    if (!contactId) {
      res.status(400).json({ error: "Contact ID is required" });
      return;
    }

    const params: RefundListParams = {
      page: parseInt(req.query.page as string) || 1,
      per_page: parseInt(req.query.per_page as string) || 200,
      sort_column: req.query.sort_column as
        | "date"
        | "refund_mode"
        | "reference_number"
        | "amount",
      sort_order: req.query.sort_order as "asc" | "desc",
    };

    const zoho = await getZohoClient();
    const refunds = await zoho.getContactRefunds(contactId, params);
    res.json(refunds);
  } catch (error) {
    handleError(error, res);
  }
};

export const searchContacts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const params: ContactSearchParams = {
      contact_name: req.query.contact_name as string,
      company_name: req.query.company_name as string,
      first_name: req.query.first_name as string,
      last_name: req.query.last_name as string,
      email: req.query.email as string,
      phone: req.query.phone as string,
      filter_by: req.query.filter_by as string,
      search_text: req.query.search_text as string,
      sort_column: req.query.sort_column as string,
      page: parseInt(req.query.page as string) || 1,
      per_page: parseInt(req.query.per_page as string) || 200,
    };

    const zoho = await getZohoClient();
    const contacts = await zoho.searchContacts(params);
    res.json(contacts);
  } catch (error) {
    handleError(error, res);
  }
};

// ----- CREATE Contacts zohobooks section -------
export const createContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contactData = req.body;

    // Validate the request body against the schema
    try {
      await contactSchema.validate(contactData, { abortEarly: false });
    } catch (validationError: any) {
      res.status(400).json({
        error: "Validation failed",
        details: validationError.errors,
      });
      return;
    }

    console.log("create contact controller contactData : ", contactData);

    const zoho = await getZohoClient();

    console.log("create contact controller zoho client got");

    const contact = await zoho.createContact(contactData as ContactData);
    console.log("contact received in createContact controller ", contact);
    res.json(contact);
  } catch (error) {
    console.log("controller catch error ", error);
    handleError(error, res);
  }
};

export const createContactPerson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { contactId } = req.params;
    const contactPersonData = req.body;

    if (!contactId) {
      res.status(400).json({ error: "Contact ID is required" });
      return;
    }

    if (!contactPersonData) {
      res.status(400).json({ error: "Contact person data is required" });
      return;
    }

    const zoho = await getZohoClient();
    const contactPerson = await zoho.createContactPerson(
      contactId,
      contactPersonData
    );
    res.json(contactPerson);
  } catch (error) {
    handleError(error, res);
  }
};

export const addContactAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { contactId } = req.params;
    const addressData = req.body;

    if (!contactId) {
      res.status(400).json({ error: "Contact ID is required" });
      return;
    }

    if (!addressData) {
      res.status(400).json({ error: "Address data is required" });
      return;
    }

    const zoho = await getZohoClient();
    const address = await zoho.addContactAddress(contactId, addressData);
    res.json(address);
  } catch (error) {
    handleError(error, res);
  }
};

// ----------- READ currencies section   ----------------
export const getCurrencies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const zoho = await getZohoClient();
    const currencies = await zoho.getCurrencies();
    res.json(currencies);
  } catch (error) {
    handleError(error, res);
  }
};

// ----------- Refunds section   ----------------
export const createRefund = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refundData: CustomerRefund = req.body;

    // Validate request data
    try {
      await refundSchema.validate(refundData, { abortEarly: false });
    } catch (validationError: any) {
      res.status(400).json({
        error: "Validation failed",
        details: validationError.errors,
      });
      return;
    }

    const zoho = await getZohoClient();
    const result = await zoho.createRefund(refundData);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};

export const getCustomerPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      res.status(400).json({ error: "Customer ID is required" });
      return;
    }

    const params: RefundListParams = {
      page: parseInt(req.query.page as string) || 1,
      per_page: parseInt(req.query.per_page as string) || 200,
    };

    const zoho = await getZohoClient();
    const payments = await zoho.getCustomerPayments(customerId, params);
    res.json(payments);
  } catch (error) {
    handleError(error, res);
  }
};

// ----------- Invoice section ----------------
export const createInvoice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoiceData: InvoiceData = req.body;

    try {
      await invoiceSchema.validate(invoiceData, { abortEarly: false });
    } catch (validationError: any) {
      res.status(400).json({
        error: "Validation failed",
        details: validationError.errors,
      });
      return;
    }

    const zoho = await getZohoClient();
    const result = await zoho.createInvoice(invoiceData);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};

export const getCustomerInvoices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      res.status(400).json({ error: "Customer ID is required" });
      return;
    }

    const zoho = await getZohoClient();
    const result = await zoho.getInvoices(customerId);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};

// ----------- Payment section ----------------
export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const paymentData: PaymentData = req.body;

    try {
      await paymentSchema.validate(paymentData, { abortEarly: false });
    } catch (validationError: any) {
      res.status(400).json({
        error: "Validation failed",
        details: validationError.errors,
      });
      return;
    }

    const zoho = await getZohoClient();
    const result = await zoho.createPayment(paymentData);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};

// ----------- credit note section ----------------
export const createCreditNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const creditNoteData: CreditNoteData = req.body;

    try {
      await creditNoteSchema.validate(creditNoteData, { abortEarly: false });
    } catch (validationError: any) {
      res.status(400).json({
        error: "Validation failed",
        details: validationError.errors,
      });
      return;
    }

    const zoho = await getZohoClient();
    const result = await zoho.createCreditNote(creditNoteData);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};

export const createCreditNoteRefund = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { creditNoteId } = req.params;
    const refundData: CreditNoteRefundData = req.body;

    if (!creditNoteId) {
      res.status(400).json({ error: "Credit note ID is required" });
      return;
    }

    try {
      await creditNoteRefundSchema.validate(refundData, { abortEarly: false });
    } catch (validationError: any) {
      res.status(400).json({
        error: "Validation failed",
        details: validationError.errors,
      });
      return;
    }

    const zoho = await getZohoClient();
    const result = await zoho.createCreditNoteRefund(creditNoteId, refundData);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};

export const getCustomerCreditNotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      res.status(400).json({ error: "Customer ID is required" });
      return;
    }

    const zoho = await getZohoClient();
    const result = await zoho.getCreditNotes(customerId);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};
