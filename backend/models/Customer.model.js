import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    phone: String,
    company: String,
    gstin: String,
    billingAddress: String,
    creditLimit: { type: Number, default: 0 },
    outstanding: { type: Number, default: 0 },
    paymentTerms: { type: String, default: "Net 30" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/* ✅ SAFE MODEL EXPORT */
export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);
