// Add custom type for our handlers
export type AsyncRequestHandler = (
  req: Request,
  res: Response
) => Promise<Response | void> | void;

// src/controllers/zoho.controller.ts
import { Request, Response } from "express";
import { createZohoClient, getAuthUrl } from "../lib/zoho-client";
import config from "../config";
import { getStoredRefreshToken } from "./token.controller";
import { ContactSearchParams } from "@/types/zoho.types";

// Custom error class for better error handling
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
  if (error instanceof ZohoError || error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: "An unknown error occurred" });
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

// ----- Contacts zohobooks section -------

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

    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 200;

    const zoho = await getZohoClient();
    const refunds = await zoho.getContactRefunds(contactId, {
      page,
      per_page: perPage,
    });
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

// -----------   ----------------

export const getInvoices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 200;

    const zoho = await getZohoClient();
    const invoices = await zoho.getInvoices(page, perPage);
    res.json(invoices);
  } catch (error) {
    handleError(error, res);
  }
};

export const getInvoice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { invoiceId } = req.params;
    if (!invoiceId) {
      res.status(400).json({ error: "Invoice ID is required" });
      return;
    }

    const zoho = await getZohoClient();
    const invoice = await zoho.getInvoice(invoiceId);
    res.json(invoice);
  } catch (error) {
    handleError(error, res);
  }
};

export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 200;

    const zoho = await getZohoClient();
    const items = await zoho.getItems(page, perPage);
    res.json(items);
  } catch (error) {
    handleError(error, res);
  }
};
