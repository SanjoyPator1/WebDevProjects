// src/routes/zoho.routes.ts
import { Router } from "express";
import multer from "multer";
import * as zohoController from "../controllers/zoho.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Maximum 5 files
  },
});

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
router.get(
  "/contacts/:contactId/statements/email",
  zohoController.getStatementEmailContent
);

// CREATE - contact-related routes
router.post("/contacts", zohoController.createContact);
router.post(
  "/contacts/:contactId/contact-persons",
  zohoController.createContactPerson
);
router.post("/contacts/:contactId/addresses", zohoController.addContactAddress);

router.post(
  "/contacts/:contactId/email",
  upload.array("attachments"), // 'attachments' is the field name for files
  zohoController.sendContactEmail
);

router.post("/contacts/:contactId/email", zohoController.sendContactEmail);

router.post("/contacts/:contactId/active", zohoController.markContactActive);

router.post(
  "/contacts/:contactId/inactive",
  zohoController.markContactInactive
);

router.post(
  "/contacts/:contactId/portal/enable",
  zohoController.enablePortalAccess
);

router.post(
  "/contacts/:contactId/paymentreminder/enable",
  zohoController.enablePaymentReminders
);

router.post(
  "/contacts/:contactId/paymentreminder/disable",
  zohoController.disablePaymentReminders
);

router.post("/contacts/:contactId/track1099", zohoController.track1099);

router.post("/contacts/:contactId/untrack1099", zohoController.untrack1099);

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
