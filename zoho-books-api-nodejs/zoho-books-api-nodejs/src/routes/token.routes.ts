// src/routes/token.routes.ts
import { Router } from "express";
import * as tokenController from "../controllers/token.controller";

const router = Router();

router.post("/", tokenController.setRefreshToken);
router.get("/", tokenController.getRefreshToken);
router.delete("/", tokenController.clearRefreshToken);

export default router;
