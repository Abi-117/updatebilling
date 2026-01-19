const Invoice = require('../models/Invoice');

exports.createInvoice = async (req, res) => {
  const invoice = await Invoice.create(req.body);
  res.json(invoice);
};

exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.find().populate('customerId');
  res.json(invoices);
};
