import SupplierPayment from "../models/SupplierPayment.js";

export const getSupplierPayments = async (req, res) => {
  try {
    const payments = await SupplierPayment.find()
      .populate("supplier", "name")
      .sort({ createdAt: 1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch supplier payments" });
  }
};
