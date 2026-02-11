import express from "express";
import Payment from "../models/Payment.js";
import PaymentLink from "../models/PaymentLink.js";
import razorpay from "../config/razorpay.js";
import Invoice from "../models/Invoice.js";

const router = express.Router();

/* ================= GET ALL PAYMENTS ================= */
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("customerId", "name email")
      .populate("invoiceId", "invoiceNo")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error("Fetch payments error:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

/* ================= VERIFY PAYMENT ================= */
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      linkId
    } = req.body;

    // 🔍 find payment link
    const link = await PaymentLink.findOne({ linkId });
    if (!link) {
      return res.status(404).json({ message: "Payment link not found" });
    }

    // ✅ CREATE PAYMENT ENTRY
    const payment = await Payment.create({
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      customerId: link.customerId,
      invoiceId: link.invoiceId,
      amount: link.amount,
      method: "Razorpay",
      status: "Completed"
    });

    // ✅ UPDATE LINK STATUS
    link.status = "Paid";
    await link.save();

    res.json({ success: true, payment });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

/* ================= REFUND PAYMENT ================= */
router.post("/:id/refund", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment || !payment.razorpayPaymentId) {
      return res.status(400).json({ message: "Invalid payment" });
    }

    await razorpay.payments.refund(payment.razorpayPaymentId);

    payment.status = "Refunded";
    await payment.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Refund error:", err);
    res.status(500).json({ message: "Refund failed" });
  }
});

router.post("/invoice/order", async (req, res) => {
  try {
    const { invoiceId } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const order = await razorpay.orders.create({
      amount: invoice.total * 100,
      currency: "INR",
      receipt: `INV_${invoice.invoiceNo}`,
    });

    // Save payment record as Pending
    const payment = await Payment.create({
      invoiceId: invoice._id,
      customerId: invoice.customerId,
      amount: invoice.total,
      method: "Razorpay",
      status: "Pending",
      razorpayOrderId: order.id,
    });

    res.json({
      orderId: order.id,
      amount: invoice.total,
      invoiceNo: invoice.invoiceNo,
      customerName: invoice.customerName,
      paymentId: payment._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

router.post("/invoice/verify", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      paymentId,
    } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.status = "Completed";
    await payment.save();

    // 🔥 MARK INVOICE AS PAID
    await Invoice.findByIdAndUpdate(payment.invoiceId, {
      status: "Paid",
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
});


export default router;
