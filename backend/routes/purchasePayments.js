import express from "express";
import {
  createPurchaseOrder,
  verifyPurchasePayment,
} from "../controllers/purchasePaymentController.js";

const router = express.Router();

// POST /api/purchase-payments/order
router.post("/order", createPurchaseOrder);

// POST /api/purchase-payments/verify
router.post("/verify", verifyPurchasePayment);

// GET /api/purchase-payments/ (optional: get all purchase bills)
import PurchaseBill from "../models/PurchaseBill.js";
router.get("/", async (req, res) => {
  try {
    const bills = await PurchaseBill.find()
      .populate("supplier", "name")
      .populate("grn", "grnNo")
      .sort({ createdAt: -1 });

    res.json(
      bills.map(b => ({
        ...b._doc,
        billDate: b.billDate || b.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
