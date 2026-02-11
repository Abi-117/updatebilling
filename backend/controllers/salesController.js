import db from "../config/db.js"; // Your database connection

// Fetch recent invoices (last 10)
export const getInvoices = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, ref, type, entity, status, time, amount, customer, payment_method, message
      FROM invoices
      ORDER BY time DESC
      LIMIT 10
    `);

    // Map to frontend format
    const invoices = result.rows.map(inv => ({
      id: inv.id,
      ref: inv.ref,
      type: inv.type,
      entity: inv.entity,
      status: inv.status,
      time: inv.time,
      amount: Number(inv.amount),
      customer: inv.customer,
      paymentMethod: inv.payment_method,
      message: inv.message,
    }));

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

// Fetch monthly sales summary
export const getMonthlySales = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT TO_CHAR(time, 'Mon') AS month, SUM(amount) AS revenue
      FROM invoices
      WHERE status='Paid'
      GROUP BY month
      ORDER BY MIN(time)
    `);

    const monthlySales = result.rows.map(row => ({
      month: row.month,
      revenue: Number(row.revenue),
    }));

    res.json(monthlySales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch monthly sales" });
  }
};
