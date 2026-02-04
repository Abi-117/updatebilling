import RecurringInvoice from "../models/RecurringInvoice.js";
import Invoice from "../models/Invoice.js";
import nodemailer from "nodemailer";

/* --- Email transporter --- */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* --- Helper to calculate next run date --- */
const getNextRunDate = (currentDate, frequency) => {
  const d = new Date(currentDate);
  if (frequency === "Monthly") d.setMonth(d.getMonth() + 1);
  if (frequency === "Quarterly") d.setMonth(d.getMonth() + 3);
  if (frequency === "Yearly") d.setFullYear(d.getFullYear() + 1);
  return d;
};

/* --- Main function --- */
export const processRecurringInvoices = async () => {
  const today = new Date();
  const plans = await RecurringInvoice.find({
    nextRun: { $lte: today },
    status: "Active",
  });

  for (const plan of plans) {
    // 1️⃣ Create invoice in DB
    const invoice = await Invoice.create({
      customer: plan.customerId,
      customerName: plan.customerName,
      customerEmail: plan.customerEmail,
      items: [
        {
          name: `Recurring Plan (${plan.frequency})`,
          qty: 1,
          rate: plan.amount,
          amount: plan.amount,
        },
      ],
      subtotal: plan.amount,
      tax: 0,
      total: plan.amount,
      date: today,
      status: "Sent",
    });

    // 2️⃣ Send email
    if (plan.customerEmail) {
      await transporter.sendMail({
        from: `"Your Company" <${process.env.SMTP_USER}>`,
        to: plan.customerEmail,
        subject: `Invoice ${invoice._id} from Your Company`,
        text: `Hello ${plan.customerName},\n\nYour invoice of ₹${plan.amount} has been generated.`,
        html: `<p>Hello ${plan.customerName},</p><p>Your invoice of <b>₹${plan.amount}</b> has been generated.</p>`,
      });
    }

    // 3️⃣ Update recurring plan
    plan.lastInvoiceId = invoice._id;
    plan.lastInvoiceStatus = "Sent";
    plan.lastInvoiceDate = today;
    plan.nextRun = getNextRunDate(plan.nextRun, plan.frequency);
    await plan.save();
  }

  console.log(`${plans.length} recurring invoices processed`);
};
