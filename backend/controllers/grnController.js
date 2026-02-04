import GRN from "../models/GRN.js";
import PurchaseBill from "../models/PurchaseBill.js";
import Counter from "../models/Counter.js";

/* ---------------- GET ALL GRNs ---------------- */
export const fetchGRNs = async (req, res) => {
  try {
    const grns = await GRN.find()
      .populate("supplier")
      .sort({ createdAt: -1 });
    res.json(grns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- CREATE GRN ---------------- */
export const createGRN = async (req, res) => {
  try {
    // Auto-increment GRN number
    const counter = await Counter.findOneAndUpdate(
      { key: "grn" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const grnNo = `GRN-${counter.seq}`;

    const grn = await GRN.create({
      ...req.body,
      grnNo,
      status: "Pending" // default status
    });

    res.status(201).json(grn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- UPDATE GRN ---------------- */
export const updateGRN = async (req, res) => {
  try {
    const grn = await GRN.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(grn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- DELETE GRN ---------------- */
export const deleteGRN = async (req, res) => {
  try {
    await GRN.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- CREATE PURCHASE BILL FROM GRN ---------------- */
export const createBillFromGRN = async (req, res) => {
  try {
    const grn = await GRN.findById(req.params.id).populate("supplier");
    if (!grn) return res.status(404).json({ message: "GRN not found" });

    if (grn.status === "Billed") {
      return res.status(400).json({ message: "Already billed" });
    }

    const counter = await Counter.findOneAndUpdate(
      { key: "purchaseBill" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const items = grn.items.map(i => ({
      name: i.name,
      qty: i.qty,
      rate: i.rate,
      amount: i.qty * i.rate,
    }));

    const total = items.reduce((s, i) => s + i.amount, 0);

    const bill = await PurchaseBill.create({
      billNo: `PB-${counter.seq}`,
      supplier: grn.supplier._id,
      grn: grn._id,
      items,
      total,
      status: "Pending",
      billDate: new Date()
    });

    grn.status = "Billed";
    await grn.save();

    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
