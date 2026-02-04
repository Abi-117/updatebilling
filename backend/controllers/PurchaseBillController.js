import PurchaseBill from "../models/PurchaseBill.js";

// Get all purchase bills
export const fetchPurchaseBills = async (req, res) => {
  try {
    const bills = await PurchaseBill.find()
      .populate("supplier", "name")
      .populate("grn", "grnNo")
      .sort({ createdAt: -1 });

    // Ensure every bill has a billDate
    const billsWithDate = bills.map(bill => ({
      ...bill._doc,
      billDate: bill.billDate || bill.createdAt
    }));

    res.json(billsWithDate);
  } catch (err) {
    console.error("Error fetching purchase bills:", err);
    res.status(500).json({ error: "Server error" });
  }
};
// Get single purchase bill
export const fetchPurchaseBill = async (req, res) => {
  const bill = await PurchaseBill.findById(req.params.id).populate("supplier grn");
  if (!bill) return res.status(404).json({ message: "Purchase bill not found" });
  res.json(bill);
};
export const getPurchaseBills = async (req, res) => {
  try {
    const bills = await PurchaseBill.find()
      .populate("supplier", "name")
      .populate("grn", "grnNo");
    res.json(bills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch purchase bills" });
  }
};