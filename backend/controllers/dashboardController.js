import { getRevenueMetrics, getNetRevenue, getReceivablesSummary } from '../services/dashboardService.js';

// GET /api/dashboard?range=YTD
export const fetchDashboardData = async (req, res) => {
  try {
    const range = req.query.range || 'YTD';

    // Fetch metrics, net revenue & receivables in parallel
    const [metrics, revenue, receivables] = await Promise.all([
      getRevenueMetrics(range),
      getNetRevenue(range),
      getReceivablesSummary(range),
    ]);

    res.json({
      metrics,
      revenue,
      receivables,
    });
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};
export const getDashboardSummary = async (req, res) => {
  try {
    const { range } = req.query;

    // 1️⃣ Get all invoices
    const invoices = await Invoice.find();

    // 2️⃣ Separate Paid & Unpaid
    const paidInvoices = invoices.filter(inv => inv.status === "Paid");
    const unpaidInvoices = invoices.filter(inv => inv.status !== "Paid");

    // 3️⃣ Calculate totals
    const totalRevenue = paidInvoices.reduce(
      (sum, inv) => sum + (inv.total || 0),
      0
    );

    const totalReceivables = unpaidInvoices.reduce(
      (sum, inv) => sum + (inv.total || 0),
      0
    );

    // 4️⃣ Monthly Revenue Chart
    const monthlyRevenue = {};

    paidInvoices.forEach(inv => {
      const month = new Date(inv.date).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = 0;
      }

      monthlyRevenue[month] += inv.total || 0;
    });

    const revenueChart = Object.keys(monthlyRevenue).map(month => ({
      month,
      value: monthlyRevenue[month],
    }));

    // 5️⃣ Monthly Receivables Chart
    const monthlyReceivables = {};

    unpaidInvoices.forEach(inv => {
      const month = new Date(inv.date).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyReceivables[month]) {
        monthlyReceivables[month] = 0;
      }

      monthlyReceivables[month] += inv.total || 0;
    });

    const receivableChart = Object.keys(monthlyReceivables).map(month => ({
      name: month,
      amount: monthlyReceivables[month],
    }));

    // 6️⃣ Send Response
    res.json({
      metrics: {
        revenue: { value: totalRevenue, growth: 0 },
        mrr: { value: 0, growth: 0 },          // remove later if not needed
        arpu: { value: 0, growth: 0 },
        ltv: { value: 0, growth: 0 },
        subscriptions: { value: 0, growth: 0 },
      },
      revenue: {
        total: totalRevenue,
        growth: "+0%",
        label: range,
        chart: revenueChart,
      },
      receivables: {
        total: totalReceivables,
        chart: receivableChart,
      },
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getNetRevenue = async (req, res) => {
  try {
    const invoices = await Invoice.find({ status: "Paid" });

    const total = invoices.reduce(
      (sum, inv) => sum + (inv.totalAmount || 0),
      0
    );

    // Monthly chart grouping
    const monthlyData = {};

    invoices.forEach((inv) => {
      const month = new Date(inv.invoiceDate).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }

      monthlyData[month] += inv.totalAmount || 0;
    });

    const chart = Object.keys(monthlyData).map((month) => ({
      month,
      value: monthlyData[month],
    }));

    res.json({
      total,
      growth: "+0%",
      label: "YTD",
      chart,
    });
  } catch (error) {
    console.error("Net revenue error:", error);
    res.status(500).json({ message: "Failed to fetch revenue" });
  }
};