import express from "express";
import {
  getPurchaseReturns,
  createPurchaseReturn,
} from "../controllers/PurchaseReturnController.js";
import { getPurchaseBills } from "../controllers/purchaseBillController.js";

const router = express.Router();

/* ================= PURCHASE BILLS ================= */
router.get("/purchase-bills", getPurchaseBills);

/* ================= PURCHASE RETURNS ================= */
router.get("/purchase-returns", getPurchaseReturns);
router.post("/purchase-returns", createPurchaseReturn);

export default router;
