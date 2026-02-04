import express from "express";
import { getLedgerBySupplier } from "../controllers/ledger.controller.js";

const router = express.Router();

router.get("/:supplierId", getLedgerBySupplier);

export default router;
