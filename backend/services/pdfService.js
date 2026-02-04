// backend/services/pdfService.js
import PDFDocument from "pdfkit";

export const generateInvoicePDFBuffer = (invoice) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(18).text("INVOICE", { align: "right" });
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`Invoice No: ${invoice.invoiceNo || invoice._id}`);
    doc.text(`Date: ${new Date(invoice.date || Date.now()).toLocaleDateString()}`);
    doc.moveDown();

    doc.text(`Customer: ${invoice.customerName}`);
    doc.text(`Email: ${invoice.customerEmail}`);
    if (invoice.customerAddress) doc.text(`Address: ${invoice.customerAddress}`);
    doc.moveDown();

    doc.fontSize(12).text("Items:");
    doc.moveDown(0.5);

    let total = 0;
    (invoice.items || []).forEach((item, i) => {
      const amount = (item.qty || 0) * (item.rate || 0);
      total += amount;
      doc.text(`${i + 1}. ${item.name || "-"} - ${item.qty} x ${item.rate} = ₹${amount.toFixed(2)}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: ₹${total.toFixed(2)}`, { align: "right" });

    doc.end();
  });
};
