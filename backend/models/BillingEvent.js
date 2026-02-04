import mongoose from "mongoose";

const billingEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Invoice Created", "Payment Received", "Invoice Overdue"],
      required: true,
    },
    entity: {
      type: String,
      enum: ["Invoice", "Subscription"],
      default: "Invoice",
    },
    ref: { type: String, required: true }, // INV-1001
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
    customer: String,
    amount: Number,
    status: {
      type: String,
      enum: ["Paid", "Pending", "Overdue"],
      default: "Pending",
    },
    time: { type: Date, default: Date.now },
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("BillingEvent", billingEventSchema);
