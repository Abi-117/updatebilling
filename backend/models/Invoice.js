import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    customerEmail: String,
    gstin: String,

    date: {
      type: Date,
      required: true,
    },

    items: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        rate: { type: Number, required: true },
        amount: { type: Number, required: true }, // 🔥 Must store for accurate totals
      },
    ],

    gstRate: { type: Number, default: 18 },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Draft", "Sent", "Paid"],
      default: "Draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/* ================= AUTO-INVOICE HOOK ================= */
InvoiceSchema.pre("validate", async function (next) {
  if (this.isNew && !this.invoiceNo) {
    try {
      // Find last invoice created
      const lastInvoice = await mongoose
        .model("Invoice")
        .findOne({})
        .sort({ createdAt: -1 })
        .lean();

      let lastNumber = 0;

      if (lastInvoice?.invoiceNo) {
        // Extract numeric part from last invoiceNo (e.g., INV0005 → 5)
        const match = lastInvoice.invoiceNo.match(/\d+$/);
        if (match) lastNumber = parseInt(match[0], 10);
      }

      // Increment by 1 and pad with leading zeros
      const newNumber = (lastNumber + 1).toString().padStart(5, "0");

      this.invoiceNo = `INV${newNumber}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default mongoose.model("Invoice", InvoiceSchema);
