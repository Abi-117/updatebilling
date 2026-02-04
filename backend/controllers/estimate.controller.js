import Estimate from "../models/Estimate.js";
import Invoice from "../models/Invoice.js";
import Customer from "../models/Customer.model.js";

/* ================= GET ALL ESTIMATES ================= */
export const getEstimates = async (req, res) => {
  try {
    let estimates = await Estimate.find()
      .sort({ createdAt: -1 })
      .lean();

    const customerIds = estimates
      .map(e => e.customerId)
      .filter(Boolean);

    const customers = await Customer.find({
      _id: { $in: customerIds },
    }).lean();

    const customerMap = {};
    customers.forEach(c => {
      customerMap[c._id.toString()] = c;
    });

    estimates = estimates.map(e => ({
      ...e,
      customerData: customerMap[e.customerId?.toString()] || {},
    }));

    res.json(estimates);
  } catch (err) {
    console.error("Error fetching estimates:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET SINGLE ESTIMATE ================= */
export const getEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id).lean();
    if (!estimate)
      return res.status(404).json({ message: "Estimate not found" });

    const customerData = estimate.customerId
      ? await Customer.findById(estimate.customerId).lean()
      : {};

    res.json({ ...estimate, customerData: customerData || {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CREATE ESTIMATE (FIXED) ================= */
export const createEstimate = async (req, res) => {
  try {
    let {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      company,
      customerAddress,
      gstin,
      date,
      items = [],
      gstRate = 18,
    } = req.body;

    if (!customerId)
      return res.status(400).json({ message: "Customer is required" });

    // 🔒 Auto-fetch customer if name missing (CRITICAL FIX)
    if (!customerName) {
      const customer = await Customer.findById(customerId);
      if (!customer)
        return res.status(400).json({ message: "Invalid customer" });

      customerName = customer.name;
      customerEmail = customer.email || "";
      customerPhone = customer.phone || "";
      company = customer.company || "";
      customerAddress = customer.address || "";
      gstin = customer.gstin || "";
    }

    // sanitize items
    const cleanItems = (items || [])
      .map(i => ({
        name: i.name?.trim() || "",
        qty: Number(i.qty) || 0,
        rate: Number(i.rate) || 0,
        amount: (Number(i.qty) || 0) * (Number(i.rate) || 0),
      }))
      .filter(i => i.name && i.amount > 0);

    if (!cleanItems.length)
      return res
        .status(400)
        .json({ message: "At least one valid item is required" });

    const subtotal = cleanItems.reduce((s, i) => s + i.amount, 0);
    const tax = (subtotal * gstRate) / 100;
    const total = subtotal + tax;

    const estimate = await Estimate.create({
      estimateNo: `EST-${Date.now()}`,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      company,
      customerAddress,
      gstin,
      date: date ? new Date(date) : new Date(),
      items: cleanItems,
      gstRate,
      subtotal,
      tax,
      total,
      status: "Draft",
      createdBy: req.user?._id || null,
    });

    res.status(201).json(estimate);
  } catch (err) {
    console.error("Error creating estimate:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ESTIMATE (FIXED) ================= */
export const updateEstimate = async (req, res) => {
  try {
    const { id } = req.params;
    const { items = [], gstRate = 18, ...rest } = req.body;

    const cleanItems = items
      .map(i => ({
        name: i.name?.trim() || "",
        qty: Number(i.qty) || 0,
        rate: Number(i.rate) || 0,
        amount: (Number(i.qty) || 0) * (Number(i.rate) || 0),
      }))
      .filter(i => i.name && i.amount > 0);

    if (!cleanItems.length)
      return res
        .status(400)
        .json({ message: "At least one valid item is required" });

    const subtotal = cleanItems.reduce((s, i) => s + i.amount, 0);
    const tax = (subtotal * gstRate) / 100;
    const total = subtotal + tax;

    const updated = await Estimate.findByIdAndUpdate(
      id,
      {
        ...rest,
        items: cleanItems,
        gstRate,
        subtotal,
        tax,
        total,
      },
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Estimate not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating estimate:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ESTIMATE ================= */
export const deleteEstimate = async (req, res) => {
  try {
    const deleted = await Estimate.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Estimate not found" });

    res.json({ message: "Estimate deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CONVERT ESTIMATE → INVOICE (FIXED) ================= */
export const convertEstimateToInvoice = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);
    if (!estimate)
      return res.status(404).json({ message: "Estimate not found" });

    if (estimate.status === "Invoiced")
      return res.status(400).json({ message: "Already invoiced" });

    const invoice = await Invoice.create({
      invoiceNo: `INV-${Date.now()}`,
      customerId: estimate.customerId,
      customerName: estimate.customerName,
      customerEmail: estimate.customerEmail,
      customerPhone: estimate.customerPhone,
      company: estimate.company,
      customerAddress: estimate.customerAddress,
      gstin: estimate.gstin,
      date: new Date(),
      items: estimate.items,
      gstRate: estimate.gstRate,
      subtotal: estimate.subtotal,
      tax: estimate.tax,
      total: estimate.total,
      status: "Draft",
      createdBy: req.user?._id || null,
    });

    estimate.status = "Invoiced";
    await estimate.save();

    // 🔒 SAFE outstanding update (NO 500)
    const customer = await Customer.findById(estimate.customerId);
    if (customer) {
      customer.outstanding =
        (customer.outstanding || 0) + (invoice.total || 0);
      await customer.save();
    }

    res.json({ invoice });
  } catch (err) {
    console.error("Convert error:", err);
    res.status(500).json({ message: err.message });
  }
};
