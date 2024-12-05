// src/routes/zoho.routes.ts
import { Router } from "express";
import * as zohoController from "../controllers/zoho.controller";

const router = Router();

router.get("/auth-url", zohoController.getAuthUrlController);
router.post("/grant-token", zohoController.handleGrantToken);
router.get("/organizations", zohoController.getOrganizations);
router.get("/invoices", zohoController.getInvoices);
router.get("/invoices/:invoiceId", zohoController.getInvoice);
router.get("/items", zohoController.getItems);

// contact-related routes
router.get("/contacts", zohoController.getContacts);
router.get("/contacts/search", zohoController.searchContacts);
router.get("/contacts/:contactId", zohoController.getContact);
router.get(
  "/contacts/:contactId/addresses",
  zohoController.getContactAddresses
);
router.get("/contacts/:contactId/comments", zohoController.getContactComments);
router.get("/contacts/:contactId/refunds", zohoController.getContactRefunds);

export default router;
