import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import PurchaseBill from "../models/PurchaseBill.js";
import Payment from "../models/Payment.js";

/* ============ CREATE ORDER ============ */
export const createPurchaseOrder = async (req, res) => {
  try {
    const { billId } = req.body;

    const bill = await PurchaseBill.findById(billId);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    const order = await razorpay.orders.create({
      amount: bill.total * 100,
      currency: "INR",
      receipt: `PB_${bill.billNo}`,
    });

    const payment = await Payment.create({
      purchaseBillId: bill._id,
      amount: bill.total,
      method: "Razorpay",
      status: "Pending",
      razorpayOrderId: order.id,
    });

    res.json({
      orderId: order.id,
      paymentId: payment._id,
      amount: bill.total,
      billNo: bill.billNo,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/* ============ VERIFY PAYMENT ============ */
export const verifyPurchasePayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentId,
    } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    payment.status = "Completed";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};
