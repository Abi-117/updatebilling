import Invoice from "../models/Invoice.js";
import Estimate from "../models/Estimate.js";

export const convertEstimateToInvoice = async (estimateId, userId) => {
  const estimate = await Estimate.findById(estimateId);
  if (!estimate) throw new Error("Estimate not found");

  if (estimate.status === "Invoiced") {
    throw new Error("This estimate is already converted to an invoice");
  }

  const invoice = new Invoice({
    customerId: estimate.customerId,
    customerName: estimate.customerName,
    customerEmail: estimate.customerEmail,
    gstin: estimate.gstin,
    date: new Date(),
    items: estimate.items.map((i) => ({ ...i, id: i._id })), // preserve item info
    gstRate: 18,
    subtotal: estimate.subtotal,
    tax: estimate.tax,
    total: estimate.total,
    status: "Draft",
    createdBy: userId,
  });

  const savedInvoice = await invoice.save();

  // Update estimate status
  estimate.status = "Invoiced";
  await estimate.save();

  return savedInvoice;
};
