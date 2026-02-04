// backend/routes/sendInvoice.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js"; // if you want route protected
import Invoice from "../models/Invoice.js";
import { generateInvoicePDFBuffer } from "../services/pdfService.js";
import { sendInvoiceEmail } from "../services/emailService.js";

const router = express.Router();

// ✅ Protect route (optional)
router.post("/send-invoice/:invoiceId", protect, async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { to, cc, bcc, subject, body } = req.body;

    if (!invoiceId) return res.status(400).json({ message: "Invoice ID required" });

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Generate PDF buffer
    const pdfBuffer = await generateInvoicePDFBuffer(invoice);

    // Send email
    const result = await sendInvoiceEmail({
      to,
      cc,
      bcc,
      subject,
      body,
      pdfBuffer,
      filename: `Invoice_${invoice.invoiceNo || invoice._id}.pdf`,
    });

    if (result.success) {
      return res.json({ message: "Invoice sent successfully!" });
    } else {
      return res.status(500).json({ message: "Failed to send invoice", error: result.error });
    }
  } catch (error) {
    console.error("Send Invoice Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
