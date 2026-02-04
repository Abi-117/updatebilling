import express from "express";
import { getSupplierLedger } from "../controllers/LedgerController.js";

const router = express.Router();

router.get("/:supplierId", getSupplierLedger);

export default router;
