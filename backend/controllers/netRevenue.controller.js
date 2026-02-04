// controllers/netRevenue.controller.js
import Invoice from '../models/Invoice.js';
import { getStartDateByRange } from '../utils/dateRange.js';

export const getNetRevenue = async (req, res) => {
  try {
    const range = req.query.range || 'YTD';
    const startDate = getStartDateByRange(range);

    // 1️⃣ Paid invoices in range
    const invoices = await Invoice.find({
      status: 'PAID',
      createdAt: { $gte: startDate },
    });

    // 2️⃣ Total revenue
    const total = invoices.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0
    );

    // 3️⃣ Month-wise grouping
    const chartMap = {};

    invoices.forEach(inv => {
      const month = inv.createdAt.toLocaleString('default', {
        month: 'short',
      });
      chartMap[month] = (chartMap[month] || 0) + inv.totalAmount;
    });

    const chart = Object.keys(chartMap).map(m => ({
      month: m,
      value: chartMap[m],
    }));

    // 4️⃣ Label for UI
    const labelMap = {
      '3M': 'Last 3 months',
      '6M': 'Last 6 months',
      '10M': 'Last 10 months',
      'YTD': 'Year to date',
    };

    res.json({
      total,
      growth: '+0%', // later improve
      label: labelMap[range] || 'Year to date',
      chart,
    });
  } catch (err) {
    res.status(500).json({ message: 'Net revenue error' });
  }
};
