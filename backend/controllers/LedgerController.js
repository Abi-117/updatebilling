import PurchaseBill from "../models/PurchaseBill.js";
import PurchaseReturn from "../models/PurchaseReturn.js";

export const getSupplierLedger = async (req, res) => {
  const { supplierId } = req.params;

  const bills = await PurchaseBill.find({ supplier: supplierId });
  const returns = await PurchaseReturn.find({ supplier: supplierId });

  let ledger = [];
  let balance = 0;

  bills.forEach(b => {
    balance += b.totalAmount;
    ledger.push({
      date: b.createdAt,
      type: "Purchase Bill",
      debit: b.totalAmount,
      credit: 0,
      balance
    });
  });

  returns.forEach(r => {
    balance -= r.returnAmount;
    ledger.push({
      date: r.createdAt,
      type: "Purchase Return",
      debit: 0,
      credit: r.returnAmount,
      balance
    });
  });

  ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

  res.json({
    ledger,
    outstanding: balance
  });
};
