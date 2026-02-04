import mongoose from "mongoose";

const PurchaseBillSchema = new mongoose.Schema({
  billNo: { type: String, required: true },
  grn: { type: mongoose.Schema.Types.ObjectId, ref: "GRN" },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  items: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      rate: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  billDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.PurchaseBill || mongoose.model("PurchaseBill", PurchaseBillSchema);
