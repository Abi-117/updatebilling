import RecurringInvoice from "../models/RecurringInvoice.js";
import Invoice from "../models/Invoice.js";

/* ================= CREATE RECURRING PLAN ================= */
export const createRecurringInvoice = async (req, res) => {
  try {
    const { customerId, customerName, customerEmail, amount, frequency, nextRun } = req.body;

    if (!customerId || !customerName || !amount || !nextRun) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const plan = await RecurringInvoice.create({
      customerId,
      customerName,
      customerEmail,
      amount: Number(amount),
      frequency: frequency || "Monthly",
      nextRun: new Date(nextRun),
      status: "Active",
      lastInvoiceStatus: "-"
    });

    res.status(201).json(plan);
  } catch (err) {
    console.error("CREATE RECURRING INVOICE ERROR:", err);
    res.status(500).json({ message: "Failed to create recurring plan", error: err.message });
  }
};

/* ================= GET ALL RECURRING PLANS ================= */
export const getRecurringInvoices = async (req, res) => {
  try {
    const plans = await RecurringInvoice.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    console.error("FETCH RECURRING INVOICES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch recurring invoices", error: err.message });
  }
};

/* ================= UPDATE STATUS / PLAN ================= */
export const updateRecurringInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await RecurringInvoice.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "Recurring plan not found" });

    res.json(updated);
  } catch (err) {
    console.error("UPDATE RECURRING INVOICE ERROR:", err);
    res.status(500).json({ message: "Failed to update recurring invoice", error: err.message });
  }
};

/* ================= DELETE PLAN ================= */
export const deleteRecurringInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await RecurringInvoice.findByIdAndDelete(id);
    res.json({ message: "Recurring plan deleted" });
  } catch (err) {
    console.error("DELETE RECURRING INVOICE ERROR:", err);
    res.status(500).json({ message: "Failed to delete recurring invoice", error: err.message });
  }
};

/* ================= SEND RECURRING INVOICE ================= */
export const sendRecurringInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await RecurringInvoice.findById(id);
    if (!plan) return res.status(404).json({ message: "Recurring plan not found" });

    // Defensive: Ensure required fields exist
    if (!plan.customerId || !plan.customerName || !plan.amount) {
      return res.status(400).json({ message: "Plan missing required customer info or amount" });
    }

    // Calculate subtotal/tax/total for invoice
    const subtotal = plan.amount;
    const tax = +(subtotal * 0.18).toFixed(2); // 18% GST
    const total = subtotal + tax;

    // Create Invoice
    const invoice = await Invoice.create({
      customerId: plan.customerId,
      customerName: plan.customerName,
      customerEmail: plan.customerEmail,
      gstin: plan.gstin || "",
      date: new Date(),
      items: [
        {
          name: `Recurring Invoice (${plan.frequency})`,
          qty: 1,
          rate: plan.amount,
          amount: plan.amount
        }
      ],
      gstRate: 18,
      subtotal,
      tax,
      total,
      status: "Sent",
      createdBy: req.user?._id || null // from auth middleware
    });

    // Update Recurring Plan
    plan.lastInvoiceId = invoice._id;
    plan.lastInvoiceStatus = "Sent";
    plan.nextRun = getNextRunDate(plan.nextRun, plan.frequency);
    await plan.save();

    res.json({ message: "Invoice sent successfully", invoice });
  } catch (err) {
    console.error("SEND RECURRING INVOICE ERROR:", err);
    res.status(500).json({ message: "Failed to send invoice", error: err.message });
  }
};

/* ================= HELPER: NEXT RUN DATE ================= */
const getNextRunDate = (currentDate, frequency) => {
  const d = new Date(currentDate);
  if (frequency === "Monthly") d.setMonth(d.getMonth() + 1);
  else if (frequency === "Quarterly") d.setMonth(d.getMonth() + 3);
  else if (frequency === "Yearly") d.setFullYear(d.getFullYear() + 1);
  return d;
};
