import mongoose from "mongoose";

const supplierPaymentSchema = new mongoose.Schema(
  {
    paymentNo: {
      type: String,
      unique: true,
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMode: {
      type: String,
      default: "Cash",
    },

    referenceNo: String,

    date: {
      type: Date,
      default: Date.now,
    },

    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model(
  "SupplierPayment",
  supplierPaymentSchema
);
