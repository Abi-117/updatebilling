import mongoose from "mongoose";

const paymentLinkSchema = new mongoose.Schema(
  {
    linkId: String,

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    customerName: String,
    email: String,

    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
    invoiceNo: String,

    amount: Number,

    status: {
      type: String,
      enum: ["Pending", "Paid", "Expired"],
      default: "Pending",
    },

    razorpayOrderId: String,
    paymentUrl: String,
    expiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("PaymentLink", paymentLinkSchema);
