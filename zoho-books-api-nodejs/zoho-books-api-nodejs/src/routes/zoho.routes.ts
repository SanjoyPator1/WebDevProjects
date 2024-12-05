// src/routes/zoho.routes.ts
import { Router } from "express";
import * as zohoController from "../controllers/zoho.controller";

const router = Router();

router.get("/auth-url", zohoController.getAuthUrlController);
router.post("/grant-token", zohoController.handleGrantToken);
router.get("/organizations", zohoController.getOrganizations);

// READ - contact-related routes
router.get("/contacts", zohoController.getContacts);
router.get("/contacts/search", zohoController.searchContacts);
router.get("/contacts/:contactId", zohoController.getContact);
router.get(
  "/contacts/:contactId/addresses",
  zohoController.getContactAddresses
);
router.get("/contacts/:contactId/comments", zohoController.getContactComments);
router.get("/contacts/:contactId/refunds", zohoController.getContactRefunds);

// CREATE - contact-related routes
router.post("/contacts", zohoController.createContact);
router.post(
  "/contacts/:contactId/contact-persons",
  zohoController.createContactPerson
);
router.post("/contacts/:contactId/addresses", zohoController.addContactAddress);

// READ - currencies-related routes
router.get("/currencies", zohoController.getCurrencies);

// Refund routes
router.post("/refunds", zohoController.createRefund);
router.get(
  "/customers/:customerId/payments",
  zohoController.getCustomerPayments
);

// Invoice routes
router.post("/invoices", zohoController.createInvoice);
router.get(
  "/customers/:customerId/invoices",
  zohoController.getCustomerInvoices
);

// Payment routes
router.post("/payments", zohoController.createPayment);

// Credit Note routes
router.post("/creditnotes", zohoController.createCreditNote);
router.get(
  "/customers/:customerId/creditnotes",
  zohoController.getCustomerCreditNotes
);
router.post(
  "/creditnotes/:creditNoteId/refunds",
  zohoController.createCreditNoteRefund
);

export default router;
