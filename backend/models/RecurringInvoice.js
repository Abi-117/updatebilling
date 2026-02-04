import mongoose from "mongoose";

const RecurringInvoiceSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerName: { type: String, required: true },
    customerEmail: String,
    amount: { type: Number, required: true },
    frequency: {
      type: String,
      enum: ["Monthly", "Quarterly", "Yearly"],
      default: "Monthly",
    },
    nextRun: { type: Date, required: true },
    lastInvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", default: null },
    lastInvoiceStatus: { type: String, default: "-" },
    status: { type: String, enum: ["Active", "Paused"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("RecurringInvoice", RecurringInvoiceSchema);
