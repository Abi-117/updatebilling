import mongoose from "mongoose";

const PurchaseReturnSchema = new mongoose.Schema(
  {
    returnNo: { type: String, unique: true },
    purchaseBill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseBill",
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    supplierName: String,
    items: [
      {
        name: String,
        qty: Number,
        rate: Number,
      },
    ],
    total: Number,
    grandTotal: Number,
  },
  { timestamps: true }
);

export default mongoose.model("PurchaseReturn", PurchaseReturnSchema);
