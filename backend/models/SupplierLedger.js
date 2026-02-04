import mongoose from "mongoose";

const supplierLedgerSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true
    },

    refType: {
      type: String,
      enum: ["GRN", "PURCHASE_BILL", "PURCHASE_RETURN", "PAYMENT"],
      required: true
    },

    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    debit: {
      type: Number,
      default: 0
    },

    credit: {
      type: Number,
      default: 0
    },

    balance: {
      type: Number,
      required: true
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.models.SupplierLedger ||
  mongoose.model("SupplierLedger", supplierLedgerSchema);
