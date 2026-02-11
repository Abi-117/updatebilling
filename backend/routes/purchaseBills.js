import express from "express";
import PurchaseBill from "../models/PurchaseBill.js";
import {
  createPurchaseOrder,
  verifyPurchasePayment,
} from "../controllers/purchasePaymentController.js";

const router = express.Router();

/* PAYMENT ROUTES */
router.post("/payment/order", createPurchaseOrder);
router.post("/payment/verify", verifyPurchasePayment);

/* GET ALL BILLS */
router.get("/", async (req, res) => {
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
});

/* GET SINGLE BILL */
router.get("/:id", async (req, res) => {
  const bill = await PurchaseBill.findById(req.params.id)
    .populate("supplier", "name")
    .populate("grn", "grnNo");

  if (!bill) return res.status(404).json({ message: "Not found" });

  res.json({
    ...bill._doc,
    billDate: bill.billDate || bill.createdAt,
  });
});

export default router;
