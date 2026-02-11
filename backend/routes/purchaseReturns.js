import express from "express";
import { getPurchaseReturns, createPurchaseReturn } from "../controllers/PurchaseReturnController.js";
import { getPurchaseBills } from "../controllers/purchaseBillController.js";

const router = express.Router();

// GET /api/purchase-returns
router.get("/", getPurchaseReturns);

// POST /api/purchase-returns
router.post("/", createPurchaseReturn);

// GET /api/purchase-bills
router.get("/bills", getPurchaseBills);

export default router;
