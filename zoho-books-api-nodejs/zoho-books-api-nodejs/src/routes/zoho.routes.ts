// src/routes/zoho.routes.ts
import { Router } from "express";
import * as zohoController from "../controllers/zoho.controller";

const router = Router();

router.get("/auth-url", zohoController.getAuthUrlController);
router.post("/grant-token", zohoController.handleGrantToken);
router.get("/organizations", zohoController.getOrganizations);
router.get("/contacts", zohoController.getContacts);
router.get("/invoices", zohoController.getInvoices);
router.get("/invoices/:invoiceId", zohoController.getInvoice);
router.get("/items", zohoController.getItems);

export default router;
