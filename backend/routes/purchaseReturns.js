import express from "express";
import {
  getPurchaseReturns,
  createPurchaseReturn,
} from "../controllers/PurchaseReturnController.js";
import { getPurchaseBills } from "../controllers/purchaseBillController.js";

const router = express.Router();

router.get("/purchase-bills", getPurchaseBills);
router.get("/purchase-returns", getPurchaseReturns);
router.post("/purchase-returns", createPurchaseReturn);

export default router;
