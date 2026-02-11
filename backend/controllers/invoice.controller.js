import Invoice from "../models/Invoice.js";
import Customer from "../models/Customer.model.js";
import Timesheet from "../models/Timesheet.js";
import BillingEvent from "../models/BillingEvent.js";

/* ================= CREATE INVOICE ================= */
export const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create({
      ...req.body,
      createdBy: req.user._id,
    });

    // ✅ Update outstanding using customerId
    await Customer.findByIdAndUpdate(invoice.customerId, {
      $inc: { outstanding: invoice.total },
    });

    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/* ================= GET ALL ================= */
/* ================= GET ALL ================= */
export const getInvoices = async (req, res) => {
  try {
    const { customerId } = req.query;

    const filter = {
      createdBy: req.user._id
    };

    // ✅ if customerId present, filter by customer
    if (customerId) {
      filter.customerId = customerId;
    }

    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


/* ================= GET ONE ================= */
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updateInvoice = async (req, res) => {
  try {
    const oldInvoice = await Invoice.findById(req.params.id);
    if (!oldInvoice) return res.status(404).json({ message: "Invoice not found" });

    const updated = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // 🔄 Adjust outstanding difference
    const diff = updated.total - oldInvoice.total;
    if (diff !== 0) {
      await Customer.findByIdAndUpdate(updated.customerId, {
        $inc: { outstanding: diff },
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // 🔄 Reduce outstanding
    await Customer.findByIdAndUpdate(invoice.customerId, {
      $inc: { outstanding: -invoice.total },
    });

    await invoice.deleteOne();
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ================= MARK PAID ================= */
export const markInvoicePaid = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    if (invoice.status !== "Paid") {
      await Customer.findByIdAndUpdate(invoice.customerId, {
        $inc: { outstanding: -invoice.total },
      });
    }

    invoice.status = "Paid";
    invoice.paidAt = new Date();
    await invoice.save();

    await BillingEvent.create({
      type: "Payment Received",
      entity: "Invoice",
      ref: invoice.invoiceNo,
      invoiceId: invoice._id,
      customer: invoice.customerName,
      amount: invoice.total,
      status: "Paid",
      message: `Payment received for ${invoice.invoiceNo}`,
    });

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GENERATE FROM TIMESHEETS ================= */
export const generateInvoiceFromTimesheets = async (req, res) => {
  try {
    const { projectId, fromDate, toDate, customerId } = req.body;

    const timesheets = await Timesheet.find({
      project: projectId,
      invoiced: { $ne: true },
      date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
    });

    if (!timesheets.length) {
      return res.status(400).json({ message: "No uninvoiced timesheets found" });
    }

    const items = timesheets.map(ts => ({
      name: ts.task,
      qty: ts.hours,
      rate: ts.rate,
      total: ts.amount,
    }));

    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const invoice = await Invoice.create({
      invoiceNo: `INV-${Date.now()}`,
      customerId,
      date: new Date(),
      items,
      subtotal,
      tax,
      total,
      status: "Draft",
      createdBy: req.user._id,
    });

    await Customer.findByIdAndUpdate(customerId, {
      $inc: { outstanding: total },
    });

    await Timesheet.updateMany(
      { _id: { $in: timesheets.map(t => t._id) } },
      { invoiced: true }
    );

    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const getInvoicesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const invoices = await Invoice.find({ customerId })
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};
// GET /api/invoices/monthly-sales
export const getMonthlySales = async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user._id });

    // Compute revenue per month
    const salesMap = {};
    invoices.forEach(inv => {
      const month = new Date(inv.date).toLocaleString("default", { month: "short" });
      salesMap[month] = (salesMap[month] || 0) + inv.total;
    });

    const monthlySales = Object.keys(salesMap).map(month => ({
      month,
      revenue: salesMap[month],
    }));

    res.json(monthlySales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

