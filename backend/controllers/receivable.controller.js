// controllers/receivable.controller.js
import Invoice from '../models/Invoice.js';
import { getStartDateByRange } from '../utils/dateRange.js';

export const getReceivableSummary = async (req, res) => {
  try {
    const range = req.query.range || 'YTD';
    const startDate = getStartDateByRange(range);

    // 1️⃣ Fetch unpaid invoices
    const invoices = await Invoice.find({
      status: 'UNPAID',
      createdAt: { $gte: startDate },
    });

    // 2️⃣ Total receivable
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

    const chart = Object.keys(chartMap).map(month => ({
      name: month,
      amount: chartMap[month],
    }));

    res.json({
      total,
      chart,
    });
  } catch (err) {
    res.status(500).json({ message: 'Receivable summary error' });
  }
};
