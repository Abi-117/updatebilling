import "./config/env.js"; 
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { fileURLToPath } from "url";
import path from "path";
import connectDB from "./config/db.js";

// =========================
// ROUTE IMPORTS (⚠️ FILES ONLY)
// =========================
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customer.routes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import receivableRoutes from "./routes/receivable.routes.js";
import netRevenueRoutes from "./routes/netRevenue.routes.js";
import estimateRoutes from "./routes/estimate.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import recurringInvoiceRoutes from "./routes/recurring.routes.js";
import grnRoutes from "./routes/grn.js";
import billRoutes from "./routes/purchaseBills.js";
import supplierRoutes from "./routes/supplier.routes.js";
import itemRoutes from "./routes/itemRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import stockValuationRoutes from "./routes/stockValuation.routes.js";
import pricingRoutes from "./routes/pricing.routes.js";
import productCodeRoutes from "./routes/productCodes.js";
import lowStockRoutes from "./routes/lowStockRoutes.js";
import expenseRoutes from "./routes/expenses.js";
import categoryRoutes from "./routes/categories.js";
import recurringExpenseRoutes from "./routes/recurringExpenses.js";
import projectRoutes from "./routes/projectRoutes.js";
import timesheetRoutes from "./routes/timesheetRoutes.js";
import eventRoutes from "./routes/event.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import supplierPaymentRoutes from "./routes/supplierPayment.routes.js";
import sendInvoiceRoutes from "./routes/sendInvoice.routes.js";
import paymentRoutes from "./routes/payments.js";
import paymentLinkRoutes from "./routes/paymentLinks.js";
import purchasePaymentRoutes from "./routes/purchasePayments.js";
import purchaseReturnRoutes from "./routes/purchaseReturns.js";
import salesRoutes from "./routes/sales.js";


// UTILS
import { processRecurringInvoices } from "./utils/sendRecurringInvoices.js";

// =========================
// CONFIG
// =========================

connectDB();

// =========================
// EXPRESS APP SETUP
// =========================
const app = express();
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow REST tools like Postman
    const allowed = /^http:\/\/localhost:\d+$/; // any localhost port
    if (allowed.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
// ⚡ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// MIDDLEWARE
// =========================
app.use(express.json({ limit: "10mb" }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================
// CRON / INTERVAL TASKS
// =========================
setInterval(() => {
  processRecurringInvoices().catch(console.error);
}, 24 * 60 * 60 * 1000); // once per day

// =========================
// API ROUTES
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/receivables", receivableRoutes);
app.use("/api/net-revenue", netRevenueRoutes);

app.use("/api/estimates", estimateRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/recurring-invoices", recurringInvoiceRoutes);

app.use("/api/grns", grnRoutes);
app.use("/api/purchase-bills", billRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/purchase-payments", purchasePaymentRoutes);
app.use("/api/purchase-returns", purchaseReturnRoutes);

app.use("/api/suppliers", supplierRoutes);
app.use("/api", supplierPaymentRoutes);


app.use("/api/items", itemRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/stock-valuation", stockValuationRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/product-codes", productCodeRoutes);
app.use("/api/low-stock", lowStockRoutes);

app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/recurring-expenses", recurringExpenseRoutes);

app.use("/api/projects", projectRoutes);
app.use("/api/timesheets", timesheetRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api", sendInvoiceRoutes);

app.use("/api/payment-links", paymentLinkRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/sales", salesRoutes);
// =========================
// HEALTH CHECK (OPTIONAL)
// =========================
app.get("/", (req, res) => {
  res.send("✅ Billing Backend API is running");
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
