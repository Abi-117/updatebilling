import Customer from '../models/Customer.js';
import Invoice from '../models/Invoice.js';
import Subscription from '../models/Subscription.js';

/**
 * Get revenue metrics
 */
export const getRevenueMetrics = async (range) => {
  // Total Revenue
  const revenueAgg = await Invoice.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;

  // Total MRR (Monthly Recurring Revenue)
  const mrrAgg = await Subscription.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: null, total: { $sum: '$monthlyAmount' } } },
  ]);
  const mrr = mrrAgg[0]?.total || 0;

  // ARPU (Average Revenue Per User)
  const customersCount = await Customer.countDocuments();
  const arpu = customersCount ? Math.round(totalRevenue / customersCount) : 0;

  // LTV (Lifetime Value) = ARPU * Avg Subscription Duration
  const avgDuration = await Subscription.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: null, avgMonths: { $avg: '$durationMonths' } } },
  ]);
  const ltv = avgDuration[0]?.avgMonths ? Math.round(arpu * avgDuration[0].avgMonths) : 0;

  // Active subscriptions
  const subscriptions = await Subscription.countDocuments({ status: 'active' });

  return {
    revenue: { value: totalRevenue, growth: 15 },
    mrr: { value: mrr, growth: 5 },
    arpu: { value: arpu, growth: 3 },
    ltv: { value: ltv, growth: 8 },
    subscriptions: { value: subscriptions, growth: 10 },
  };
};

/**
 * Net Revenue chart
 */


export const getNetRevenue = async (req, res) => {
  try {
    const { range } = req.query;

    let startDate;

    const now = new Date();

    if (range === "YTD") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (range === "MTD") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(0);
    }

    const revenue = await Invoice.aggregate([
      {
        $match: {
          status: "Paid", // ✅ IMPORTANT FIX
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    res.json({
      netRevenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    console.error("Net revenue error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Receivable summary chart
 */
export const getReceivablesSummary = async (range) => {
  const invoices = await Invoice.find({ status: 'unpaid' });
  const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  // Group by customer
  const customersMap = {};
  invoices.forEach(inv => {
    if (!customersMap[inv.customerName]) customersMap[inv.customerName] = 0;
    customersMap[inv.customerName] += inv.amount;
  });

  const chart = Object.keys(customersMap).map(name => ({
    name,
    amount: customersMap[name],
  }));

  return { total, chart };
};
