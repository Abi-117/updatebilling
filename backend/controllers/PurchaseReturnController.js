import PurchaseReturn from "../models/PurchaseReturn.js";

export const getPurchaseReturns = async (req, res) => {
  try {
    const returns = await PurchaseReturn.find()
      .populate({
        path: "purchaseBill",
        select: "billNo supplier",
        populate: {
          path: "supplier",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

export const createPurchaseReturn = async (req, res) => {
  try {
    const { purchaseBill } = req.body;

    const exists = await PurchaseReturn.findOne({ purchaseBill });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Purchase bill already returned" });
    }

    req.body.returnNo =
      "PR-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    const saved = await PurchaseReturn.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
