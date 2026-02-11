import PaymentLink from "../models/PaymentLink.js";
import Customer from "../models/Customer.model.js";
import Invoice from "../models/Invoice.js";
import razorpay from "../config/razorpay.js";

export const createPaymentLink = async (req, res) => {
  const { customerId, invoiceId, amount, expiresAt } = req.body;

  const customer = await Customer.findById(customerId);
  const invoice = await Invoice.findById(invoiceId);

  const linkId = "PL-" + Math.floor(100000 + Math.random() * 900000);

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: linkId
  });

  const link = await PaymentLink.create({
    linkId,
    customerId,
    customerName: customer.name,
    email: customer.email,
    invoiceId,
    invoiceNo: invoice.invoiceNo,
    amount,
    razorpayOrderId: order.id,
    paymentUrl: `${process.env.FRONTEND_URL}/pay/${linkId}`,
    expiresAt
  });

  res.json(link);
};

export const getPaymentLinks = async (req, res) => {
  const links = await PaymentLink.find().sort({ createdAt: -1 });
  res.json(links);
};
export const getPublicPaymentLink = async (req, res) => {
  try {
    const { linkId } = req.params;

    const link = await PaymentLink.findOne({ linkId });

    if (!link)
      return res.status(404).json({ message: "Invalid payment link" });

    if (link.status === "Paid")
      return res.status(400).json({ message: "Payment link already used" });

    res.json(link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
