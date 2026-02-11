import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    razorpayPaymentId: String,
    razorpayOrderId: String,

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
   
    amount: Number,
    method: String,

    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
