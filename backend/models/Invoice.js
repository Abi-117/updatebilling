const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  invoiceNumber: String,
  date: Date,
  totalAmount: Number,
  status: {
    type: String,
    default: 'Unpaid'
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
