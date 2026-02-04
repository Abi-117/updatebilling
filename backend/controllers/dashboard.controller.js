// controllers/dashboard.controller.js
import Subscription from '../models/Subscription.model.js';
import Invoice from '../models/Invoice.js';
import { getStartDateByRange } from '../utils/dateRange.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    const range = req.query.range || 'YTD';
    const startDate = getStartDateByRange(range);

    // 1️⃣ Active subscriptions
    const activeSubscriptions = await Subscription.countDocuments({
      status: 'ACTIVE',
    });

    // 2️⃣ Revenue (PAID invoices only)
    const revenueAgg = await Invoice.aggregate([
      {
        $match: {
          status: 'PAID',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    const revenue = revenueAgg[0]?.total || 0;

    // 3️⃣ Calculations
    const mrr = revenue;
    const arpu = activeSubscriptions ? revenue / activeSubscriptions : 0;
    const ltv = arpu * 12;

    // 4️⃣ Send fresh data ONLY
    res.json({
      revenue: { value: revenue, growth: 0 },
      mrr: { value: mrr, growth: 0 },
      arpu: { value: Math.round(arpu), growth: 0 },
      ltv: { value: Math.round(ltv), growth: 0 },
      subscriptions: {
        value: activeSubscriptions,
        growth: 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard error' });
  }
};
