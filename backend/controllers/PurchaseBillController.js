import express from "express";
import PurchaseBill from "../models/PurchaseBill.js";
import {
  createPurchaseOrder,
  verifyPurchasePayment,
} from "../controllers/purchasePaymentController.js";




const router = express.Router();

// Payment routes
router.post("/order", createPurchaseOrder);
router.post("/verify", verifyPurchasePayment);

// GET all purchase bills
router.get("/", async (req, res) => {
  try {
    const bills = await PurchaseBill.find()
      .populate("supplier", "name")
      .populate("grn", "grnNo")
      .sort({ createdAt: -1 });

    const billsWithDate = bills.map(bill => ({
      ...bill._doc,
      billDate: bill.billDate || bill.createdAt,
    }));

    res.json(billsWithDate);
  } catch (err) {
    console.error("Error fetching purchase bills:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single bill
router.get("/:id", async (req, res) => {
  try {
    const bill = await PurchaseBill.findById(req.params.id)
      .populate("supplier", "name")
      .populate("grn", "grnNo");

    if (!bill) {
      return res.status(404).json({ message: "Purchase bill not found" });
    }

    res.json({
      ...bill._doc,
      billDate: bill.billDate || bill.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


/* =========================
   GET ALL PURCHASE BILLS
========================= */
export const getPurchaseBills = async (req, res) => {
  try {
    const bills = await PurchaseBill.find()
      .populate("supplier", "name")
      .populate("grn", "grnNo")
      .sort({ createdAt: -1 });

    res.json(
      bills.map(bill => ({
        ...bill._doc,
        billDate: bill.billDate || bill.createdAt,
      }))
    );
  } catch (error) {
    console.error("Get purchase bills error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET SINGLE PURCHASE BILL
========================= */
export const getPurchaseBillById = async (req, res) => {
  try {
    const bill = await PurchaseBill.findById(req.params.id)
      .populate("supplier", "name")
      .populate("grn", "grnNo");

    if (!bill) {
      return res.status(404).json({ message: "Purchase bill not found" });
    }

    res.json({
      ...bill._doc,
      billDate: bill.billDate || bill.createdAt,
    });
  } catch (error) {
    console.error("Get bill error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export default router;
