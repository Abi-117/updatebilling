// routes/purchaseBills.js
import express from "express";
import PurchaseBill from "../models/PurchaseBill.js";

const router = express.Router();

// GET /api/purchase-bills
router.get("/", async (req, res) => {
  try {
    // Fetch all bills with supplier and GRN populated
    const bills = await PurchaseBill.find()
      .populate("supplier", "name")
      .populate("grn", "grnNo")
      .sort({ createdAt: -1 });

    // Ensure each bill has a billDate (fallback to createdAt if missing)
    const billsWithDate = bills.map(bill => ({
      ...bill._doc,
      billDate: bill.billDate || bill.createdAt
    }));

    res.json(billsWithDate);
  } catch (err) {
    console.error("Error fetching purchase bills:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/purchase-bills/:id
router.get("/:id", async (req, res) => {
  try {
    const bill = await PurchaseBill.findById(req.params.id)
      .populate("supplier", "name")
      .populate("grn", "grnNo");

    if (!bill) return res.status(404).json({ message: "Purchase bill not found" });

    // Ensure billDate exists
    const billWithDate = {
      ...bill._doc,
      billDate: bill.billDate || bill.createdAt
    };

    res.json(billWithDate);
  } catch (err) {
    console.error("Error fetching purchase bill:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
