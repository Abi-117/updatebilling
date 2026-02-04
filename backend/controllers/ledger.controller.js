import SupplierLedger from "../models/SupplierLedger.js";

export const getLedgerBySupplier = async (req, res) => {
  const data = await SupplierLedger.find({
    supplier: req.params.supplierId
  }).sort({ createdAt: 1 });

  res.json(data);
};
