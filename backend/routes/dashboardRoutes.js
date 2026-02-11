import express from "express";
import Invoice from "../models/Invoice.js";
import Expense from "../models/Expense.js";
import PurchaseBill from "../models/PurchaseBill.js";




const router = express.Router();

/* ===========================
   GET /api/dashboard
=========================== */


router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find();

    const paidInvoices = invoices.filter(inv => inv.status === "Paid");
    const unpaidInvoices = invoices.filter(inv => inv.status !== "Paid");

    const totalRevenue = paidInvoices.reduce(
      (sum, inv) => sum + (inv.total || 0),
      0
    );

    const totalReceivables = unpaidInvoices.reduce(
      (sum, inv) => sum + (inv.total || 0),
      0
    );

    // Monthly Revenue Chart
    const monthlyRevenue = {};

    paidInvoices.forEach(inv => {
      const month = new Date(inv.date).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyRevenue[month]) monthlyRevenue[month] = 0;
      monthlyRevenue[month] += inv.total || 0;
    });

    const revenueChart = Object.keys(monthlyRevenue).map(month => ({
      month,
      value: monthlyRevenue[month],
    }));

    // Monthly Receivable Chart
    const monthlyReceivables = {};

    unpaidInvoices.forEach(inv => {
      const month = new Date(inv.date).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyReceivables[month]) monthlyReceivables[month] = 0;
      monthlyReceivables[month] += inv.total || 0;
    });

    const receivableChart = Object.keys(monthlyReceivables).map(month => ({
      name: month,
      amount: monthlyReceivables[month],
    }));

    res.json({
      metrics: {
        revenue: { value: totalRevenue, growth: 0 },
        mrr: { value: 0, growth: 0 },
        arpu: { value: 0, growth: 0 },
        ltv: { value: 0, growth: 0 },
        subscriptions: { value: 0, growth: 0 },
      },
      revenue: {
        total: totalRevenue,
        growth: "+0%",
        label: "Net Revenue",
        chart: revenueChart,
      },
      receivables: {
        total: totalReceivables,
        chart: receivableChart,
      },
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   GET /api/dashboard/net-revenue
=========================== */
router.get("/net-revenue", async (req, res) => {
  try {
    const invoices = await Invoice.find({ status: "Paid" });

    const total = invoices.reduce(
      (sum, inv) => sum + (inv.total || 0),
      0
    );

    res.json({
      total,
    });
  } catch (err) {
    console.error("Net revenue error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   GET /api/dashboard/summary
=========================== */
router.get("/summary", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const expenses = await Expense.find();
    const purchaseBills = await PurchaseBill.find();

    const totalRevenue = invoices
      .filter(inv => inv.status === "Paid")
      .reduce((sum, inv) => sum + (inv.total || 0), 0);

    const totalReceivables = invoices
      .filter(inv => inv.status !== "Paid")
      .reduce((sum, inv) => sum + (inv.total || 0), 0);

    const totalExpenses = expenses.reduce(
      (sum, exp) => sum + (exp.amount || 0),
      0
    );

    const totalPayables = purchaseBills
      .filter(bill => bill.status !== "Paid")
      .reduce((sum, bill) => sum + (bill.total || 0), 0);

    const netRevenue = totalRevenue - totalExpenses;

    res.json({
      totalRevenue,
      totalExpenses,
      netRevenue,
      totalReceivables,
      totalPayables,
      paidInvoiceCount: invoices.filter(i => i.status === "Paid").length,
      unpaidInvoiceCount: invoices.filter(i => i.status !== "Paid").length,
    });

  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===========================
   GET /api/dashboard/receivables
=========================== */
router.get("/receivables", async (req, res) => {
  try {
    const unpaid = await Invoice.find({
      status: { $ne: "Paid" },
    });

    const total = unpaid.reduce(
      (sum, inv) => sum + (inv.total || 0),
      0
    );

    const monthly = {};

    unpaid.forEach(inv => {
      const month = new Date(inv.date).toLocaleString("default", {
        month: "short",
      });

      if (!monthly[month]) monthly[month] = 0;
      monthly[month] += inv.total || 0;
    });

    const chart = Object.keys(monthly).map(month => ({
      name: month,
      amount: monthly[month],
    }));

    res.json({
      total,
      chart,
    });

  } catch (err) {
    console.error("Receivable error:", err);
    res.status(500).json({ message: "Failed to fetch receivables" });
  }
});

export default router;
