import crypto from "crypto";
import Payment from "../models/Payment.js";
import PaymentLink from "../models/PaymentLink.js";
import Invoice from "../models/Invoice.js";
import Customer from "../models/Customer.model.js";

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const link = await PaymentLink.findOne({
    razorpayOrderId: razorpay_order_id
  });

  await Payment.create({
    paymentId: "PAY-" + Date.now(),
    paymentLinkId: link._id,
    customerId: link.customerId,
    invoiceId: link.invoiceId,
    amount: link.amount,
    status: "Completed",
    razorpayPaymentId: razorpay_payment_id
  });

  link.status = "Paid";
  await link.save();

  await Invoice.findByIdAndUpdate(link.invoiceId, { status: "Paid" });
  await Customer.findByIdAndUpdate(link.customerId, {
    $inc: { outstanding: -link.amount }
  });

  res.json({ success: true });
};
