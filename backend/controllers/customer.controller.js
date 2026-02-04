import Customer from "../models/customer.model.js";
import Invoice from "../models/Invoice.js";

/* ---------------- CREATE ---------------- */
export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ---------------- GET ALL ---------------- */
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // 🔥 AUTO CALCULATE OUTSTANDING FOR EACH CUSTOMER
    const customersWithOutstanding = await Promise.all(
      customers.map(async (cust) => {
        const invoices = await Invoice.find({
          customerId: cust._id,
          status: { $ne: "Paid" },
        });

        const outstanding = invoices.reduce(
          (sum, inv) => sum + (inv.total || 0),
          0
        );

        return {
          ...cust,
          outstanding,
        };
      })
    );

    res.json(customersWithOutstanding);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- GET ONE ---------------- */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    }).lean();

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    // 🔥 AUTO CALCULATE OUTSTANDING
    const invoices = await Invoice.find({
      customerId: customer._id,
      status: { $ne: "Paid" },
    });

    const outstanding = invoices.reduce(
      (sum, inv) => sum + (inv.total || 0),
      0
    );

    res.json({
      ...customer,
      outstanding,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- UPDATE ---------------- */
export const updateCustomer = async (req, res) => {
  try {
    // ❌ outstanding update panna koodaadhu
    const { outstanding, ...safeBody } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      safeBody,
      { new: true, runValidators: true }
    );

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ---------------- DELETE ---------------- */
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
